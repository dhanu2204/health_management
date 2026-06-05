import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Heart, Droplets, Wind, Scale, Ruler, Info } from 'lucide-react';
import axios from 'axios';

const HealthStats = () => {
    const [loading, setLoading] = useState(true);
    const [readings, setReadings] = useState([]);

    const triggerVibration = () => {
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    };

    const getIconForLabel = (label) => {
        const lower = label.toLowerCase();
        if (lower.includes('blood pressure') || lower.includes('bp')) return <Heart color="#ef4444" />;
        if (lower.includes('sugar') || lower.includes('glucose')) return <Droplets color="#3b82f6" />;
        if (lower.includes('heart') || lower.includes('pulse') || lower.includes('hr')) return <Activity color="#10b981" />;
        if (lower.includes('spo2') || lower.includes('oxygen')) return <Wind color="#0ea5e9" />;
        if (lower.includes('weight') || lower.includes('bmi')) return <Scale color="#8b5cf6" />;
        if (lower.includes('height')) return <Ruler color="#f59e0b" />;
        return <Activity color="#64748b" />;
    };

    useEffect(() => {
        const fetchAndAnalyzeData = async () => {
            try {
                const userId = 1;
                const response = await axios.get(`https://health-management-e61z.onrender.com/api/documents/user/${userId}`);
                const documents = response.data;

                if (!documents || documents.length === 0) {
                    setReadings([]);
                    setLoading(false);
                    return;
                }

                const recentDocs = documents.slice(-5);
                const combinedText = recentDocs.map(doc => doc.aiAnalysis).join("\n\n");

                const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                
                // The prompt now requests an array of detailed objects based on the user's requirements
                const prompt = `You are a medical data extractor. Review these recent medical reports and extract the patient's most recent readings of bp, pulse, weight, height, bmi, spo2, blood glucose, and any other readings available.
Return ONLY a valid JSON array of objects. Do not include markdown formatting like \`\`\`json. Each object must have EXACTLY these keys:
"label": (e.g. "Blood Pressure", "SpO2", "BMI"),
"value": (the extracted value, e.g. "120/80", "98"),
"unit": (e.g. "mmHg", "%", "kg"),
"normalRange": (the normal range for a healthy adult),
"meaning": (what this reading means exactly),
"suggestion": (what might happen if abnormal, and what the patient should do to maintain a healthy lifestyle)

If no readings are found at all, return an empty array []. Reports:\n\n${combinedText}`;

                const aiResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                const data = await aiResponse.json();
                const answer = data.candidates[0].content.parts[0].text;
                
                const cleanJson = answer.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                
                if (Array.isArray(parsed)) {
                    setReadings(parsed);
                } else {
                    setReadings([]);
                }
                
                triggerVibration();
            } catch (error) {
                console.error("Error analyzing health stats:", error);
                setReadings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndAnalyzeData();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Comprehensive Health Statistics</h1>
            <p style={styles.subtitle}>Deep AI analysis based on your real Medical Vault records.</p>
            
            <div style={styles.hardwareWarning}>
                <strong>📱 Mobile Sensor Limitation:</strong> We successfully triggered your phone's vibration motor! However, web browsers are strictly blocked by Apple/Google from secretly accessing SpO2, Heart Rate, or Health/Fit sensors. We have instead used AI to deeply analyze these vital signs from your uploaded prescriptions.
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>🤖 AI is conducting a deep analysis of your medical history...</p>
                </div>
            ) : readings.length === 0 ? (
                <div style={styles.chartPlaceholder}>
                    <TrendingUp size={48} color="#94a3b8" />
                    <p>No vital signs were found in your recent uploads. Upload a detailed health report to see your stats here.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {readings.map((item, idx) => (
                        <div key={idx} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {getIconForLabel(item.label)}
                                    <span style={styles.label}>{item.label}</span>
                                </div>
                                <span style={styles.status}>Tracked</span>
                            </div>
                            
                            <div style={styles.valueRow}>
                                <span style={styles.value}>{item.value}</span>
                                <span style={styles.unit}>{item.unit}</span>
                            </div>
                            
                            <div style={styles.normalRange}>
                                <strong>Normal Range:</strong> {item.normalRange}
                            </div>
                            
                            <div style={styles.detailBox}>
                                <div style={styles.detailTitle}><Info size={14} /> What this means</div>
                                <p style={styles.detailText}>{item.meaning}</p>
                            </div>
                            
                            <div style={{...styles.detailBox, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0'}}>
                                <div style={{...styles.detailTitle, color: '#166534'}}><Activity size={14} /> AI Suggestion</div>
                                <p style={{...styles.detailText, color: '#166534'}}>{item.suggestion}</p>
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
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif'
    },
    title: {
        fontSize: '32px',
        color: '#1e293b',
        marginBottom: '10px',
        fontWeight: '700'
    },
    subtitle: {
        color: '#64748b',
        marginBottom: '20px',
        fontSize: '16px'
    },
    hardwareWarning: {
        backgroundColor: '#fffbeb',
        color: '#92400e',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '30px',
        fontSize: '14.5px',
        borderLeft: '4px solid #f59e0b',
        lineHeight: '1.6'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
    },
    card: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
    },
    label: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#334155'
    },
    status: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    valueRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        marginBottom: '12px'
    },
    value: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: '-0.5px'
    },
    unit: {
        fontSize: '16px',
        color: '#64748b',
        fontWeight: '500'
    },
    normalRange: {
        fontSize: '13px',
        color: '#475569',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #f1f5f9'
    },
    detailBox: {
        backgroundColor: '#f8fafc',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '12px',
        border: '1px solid #f1f5f9'
    },
    detailTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '6px'
    },
    detailText: {
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#334155',
        margin: 0
    },
    chartPlaceholder: {
        marginTop: '40px',
        height: '250px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '2px dashed #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        textAlign: 'center',
        padding: '20px'
    }
};

export default HealthStats;
