import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Calendar, ExternalLink, Trash2 } from 'lucide-react';

const MedicalVault = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFileUrl = (url) => {
        if (!url) return "#";
        if (url.startsWith("http")) return url;
        // If the URL in DB doesn't have uploads folder, we append it for older records
        if (!url.startsWith("uploads/")) return `https://health-management-e61z.onrender.com/uploads/${url}`;
        return `https://health-management-e61z.onrender.com/${url}`;
    };

    const formatAIResponse = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} style={{ color: '#0f172a', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
            if (line.trim().startsWith('## ') || line.trim().startsWith('### ')) {
                const headerText = formattedLine.map((part) => typeof part === 'string' ? part.replace(/^#+\s/, '') : part);
                return <h3 key={index} style={{ color: '#0f172a', marginTop: '12px', marginBottom: '6px', fontSize: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>{headerText}</h3>;
            }
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const listContent = formattedLine.map((part, i) => (i === 0 && typeof part === 'string') ? part.replace(/^[\*\-]\s/, '') : part);
                return <li key={index} style={{ marginLeft: '16px', marginBottom: '4px', color: '#334155', lineHeight: '1.4' }}>{listContent}</li>;
            }
            if (line.trim() === '') return <div key={index} style={{ height: '6px' }}></div>;
            return <p key={index} style={{ margin: '0 0 4px 0', lineHeight: '1.4', color: '#334155' }}>{formattedLine}</p>;
        });
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    setLoading(false);
                    return;
                }
                const parsedUser = JSON.parse(storedUser);
                
                if (parsedUser && parsedUser.id) {
                    const response = await axios.get(`https://health-management-e61z.onrender.com/api/documents/user/${parsedUser.id}`);
                    setDocuments(response.data);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleDelete = async (docId) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        try {
            await axios.delete(`https://health-management-e61z.onrender.com/api/documents/${docId}`);
            // Remove the deleted document from the screen instantly
            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete document.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Medical Digital Vault</h1>
            <p style={styles.subtitle}>Your centralized repository for all medical records and prescriptions.</p>

            {loading ? (
                <p>Loading your vault...</p>
            ) : documents.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>No documents found. Start by uploading a new prescription!</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {documents.map((doc) => (
                        <div key={doc.id} style={styles.card}>
                            <div style={styles.iconWrapper}>
                                <FileText size={24} color="#0369a1" />
                            </div>
                            <div style={styles.cardContent}>
                                <h3 style={styles.docName}>{doc.documentType || 'Medical Record'}</h3>
                                <div style={styles.meta}>
                                    <Calendar size={14} />
                                    <span>{doc.uploadeDate}</span>
                                </div>
                                <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 5px 0' }}>AI Analysis Report:</h4>
                                    <div style={{ fontSize: '13px', color: '#475569', whiteSpace: 'normal', maxHeight: '250px', overflowY: 'auto', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        {doc.aiAnalysis ? formatAIResponse(doc.aiAnalysis) : "No AI analysis available for this document."}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <a href={getFileUrl(doc.fileurl)} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                        View Original Image <ExternalLink size={14} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(doc.id)} 
                                        style={styles.deleteButton}
                                        title="Delete Document"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#64748b',
        marginBottom: '30px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    iconWrapper: {
        backgroundColor: '#e0f2fe',
        padding: '12px',
        borderRadius: '10px'
    },
    cardContent: {
        flex: 1
    },
    docName: {
        fontSize: '18px',
        margin: '0 0 5px 0',
        color: '#0f172a'
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '14px',
        color: '#94a3b8',
        marginBottom: '10px'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#0369a1',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500'
    },
    deleteButton: {
        background: '#fee2e2',
        border: '1px solid #fca5a5',
        color: '#ef4444',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        padding: '6px 10px',
        borderRadius: '6px',
        fontWeight: '500'
    },
    emptyState: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #e2e8f0'
    }
};

export default MedicalVault;
