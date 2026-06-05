import React, { useState } from 'react';
import { Send, Bot, User, Stethoscope } from 'lucide-react';

const SymptomChecker = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI Health Assistant. Please describe the symptoms you are experiencing.' }
    ]);
    const [input, setInput] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setAnalyzing(true);

        // Fetch AI Response from Gemini
        const fetchAIResponse = async () => {
            try {
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

                // Construct conversation history for context
                const conversationContext = messages.map(msg => 
                    `${msg.role === 'bot' ? 'Assistant' : 'Patient'}: ${msg.text}`
                ).join('\n');

                const prompt = `You are a professional, empathetic Medical AI Assistant. Based on the patient's symptoms, provide a brief analysis and recommend the type of specialist they should consult. If symptoms are critical (like chest pain, severe bleeding, difficulty breathing), strongly recommend immediate emergency care. Keep your response brief, friendly, and formatted as plain text (no markdown).\n\nConversation so far:\n${conversationContext}\nPatient: ${input}\nAssistant:`;

                const requestBody = {
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                };

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (data.error) {
                    setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error.message}` }]);
                } else if (data.candidates && data.candidates.length > 0) {
                    const answer = data.candidates[0].content?.parts[0]?.text;
                    setMessages(prev => [...prev, { role: 'bot', text: answer || "I couldn't process that. Please try again." }]);
                } else {
                    setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't understand that." }]);
                }
            } catch (error) {
                console.error("Error asking Gemini:", error);
                setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again." }]);
            } finally {
                setAnalyzing(false);
            }
        };

        fetchAIResponse();
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Stethoscope size={28} color="#b91c1c" />
                <h2 style={styles.title}>AI Symptom Triage</h2>
            </div>
            
            <div style={styles.chatWindow}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        ...styles.messageRow,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        {msg.role === 'bot' && <Bot size={20} style={styles.avatar} />}
                        <div style={{
                            ...styles.bubble,
                            backgroundColor: msg.role === 'user' ? '#1e40af' : '#f1f5f9',
                            color: msg.role === 'user' ? '#fff' : '#1e293b',
                            borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        }}>
                            {msg.text}
                        </div>
                        {msg.role === 'user' && <User size={20} style={styles.avatarUser} />}
                    </div>
                ))}
                {analyzing && <div style={styles.loading}>AI is analyzing your symptoms...</div>}
            </div>

            <div style={styles.inputArea}>
                <input 
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe how you feel (e.g. 'I have a dry cough and fever')"
                />
                <button onClick={handleSend} style={styles.sendButton}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f1f5f9',
        marginBottom: '20px'
    },
    title: {
        fontSize: '20px',
        margin: 0,
        color: '#0f172a'
    },
    chatWindow: {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '10px'
    },
    messageRow: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px'
    },
    bubble: {
        maxWidth: '80%',
        padding: '12px 16px',
        fontSize: '15px',
        lineHeight: '1.5'
    },
    avatar: {
        backgroundColor: '#fef2f2',
        padding: '8px',
        borderRadius: '50%',
        color: '#b91c1c'
    },
    avatarUser: {
        backgroundColor: '#eff6ff',
        padding: '8px',
        borderRadius: '50%',
        color: '#1e40af'
    },
    inputArea: {
        display: 'flex',
        gap: '10px',
        paddingTop: '20px',
        borderTop: '1px solid #f1f5f9'
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        borderRadius: '25px',
        border: '1px solid #e2e8f0',
        outline: 'none',
        fontSize: '15px'
    },
    sendButton: {
        backgroundColor: '#1e40af',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loading: {
        fontSize: '12px',
        color: '#64748b',
        fontStyle: 'italic',
        marginLeft: '45px'
    }
};

export default SymptomChecker;
