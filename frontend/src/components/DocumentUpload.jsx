import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function DocumentUpload() {
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [geminiFile, setGeminiFile] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to beautifully format Gemini's markdown response
  const formatAIResponse = (text) => {
    if (!text) return null;
    
    // First, if there's a Google Error, just show it normally
    if (text.startsWith("Google API Error") || text.startsWith("Connection Error")) {
        return <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{text}</p>;
    }

    return text.split('\n').map((line, index) => {
      // 1. Handle bold text (**text**)
      const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ color: '#0f172a', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // 2. Handle headers (## Header or ### Header)
      if (line.trim().startsWith('## ') || line.trim().startsWith('### ')) {
        const headerText = formattedLine.map((part) => 
            typeof part === 'string' ? part.replace(/^#+\s/, '') : part
        );
        return <h3 key={index} style={{ color: '#0f172a', marginTop: '20px', marginBottom: '10px', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>{headerText}</h3>;
      }
      
      // 3. Handle bullet points (* point or - point)
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const listContent = formattedLine.map((part, i) => {
          if (i === 0 && typeof part === 'string') {
            return part.replace(/^[\*\-]\s/, ''); // Remove the asterisk/dash for clean rendering
          }
          return part;
        });
        
        return (
          <li key={index} style={{ marginLeft: '24px', marginBottom: '8px', color: '#334155', lineHeight: '1.6' }}>
            {listContent}
          </li>
        );
      }
      
      // 4. Handle empty lines
      if (line.trim() === '') return <div key={index} style={{ height: '12px' }}></div>;

      // 5. Handle standard paragraphs
      return <p key={index} style={{ marginBottom: '8px', lineHeight: '1.6', color: '#334155' }}>{formattedLine}</p>;
    });
  };

 
  // ==========================================
  // OPTION 2 LOGIC: Gemini AI Scan
  // ==========================================
  const openFiles = () => {
    fileRef.current.click();
  };

  const openCamera = () => {
    cameraRef.current.click();
  };

  const handleGeminiFileChange = (event) => {
    const selected = event.target.files[0];
    if (selected) {
      setGeminiFile(selected);
      setAiResponse(""); // Clear previous response when new file is selected
    }
  };

  useEffect(() => {
    if (!geminiFile) return;

    const uploadToVault = async (analysisText) => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const actualUserId = parsedUser && parsedUser.id ? parsedUser.id : 1; // Fallback to 1 if not found

      const formData = new FormData();
      formData.append('file', geminiFile);
      formData.append('userId', actualUserId);
      if (analysisText) {
        formData.append('aiAnalysis', analysisText);
      }

      try {
        await axios.post('https://health-management-e61z.onrender.com/api/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Image securely saved to Medical Digital Vault.");
      } catch (error) {
        console.error("Failed to save to Medical Vault:", error);
      }
    };

    const analyzeImageAutomatically = async () => {
      setIsLoading(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(geminiFile);
      
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        
        // Read the API key securely from the .env file
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const requestBody = {
          contents: [{
            parts: [
              { text: "You are a medical AI assistant. Analyze this prescription image and return ONLY the following structured information using markdown formatting:\n\n## 1. Doctor Details\n* **Doctor Name:** [Extract Name]\n* **Prescription Date:** [Extract Date]\n\n## 2. Medicines Prescribed\nFor each medicine found, provide:\n* **Medicine Name:** \n* **What it is:** (Brief description of the drug class)\n* **Why it is provided & Target Disease:** (The purpose of this drug)\n* **Dosage:** (Exact dosage on the prescription)\n* **Timings:** (When to take it)\n\n## 3. Disease & Symptom Analysis\nBased solely on the medicines prescribed above, provide a detailed analysis of what disease or symptoms the patient is likely suffering from.\\n provide the details of bp,pulse,weight,height, bmi , spo2,and thier blood glucose level ,and any other readings mentioned related to that specific diseases if available.\n\nDo not include any other filler text or information outside of this structure." },
              { inlineData: { mimeType: geminiFile.type, data: base64Image } }
            ]
          }]
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
          });
          
          const data = await response.json();
          
          if (data.error) {
            setAiResponse(`Google API Error: ${data.error.message}`);
            return;
          }
          
          if (data.candidates && data.candidates.length > 0) {
            if (data.candidates[0].finishReason !== 'STOP') {
              setAiResponse(`Warning: AI stopped early. Reason: ${data.candidates[0].finishReason}`);
              return;
            }
            
            const answer = data.candidates[0].content?.parts[0]?.text;
            if (answer) {
              setAiResponse(answer);
              // Now that we have the answer, upload both image and analysis to the vault
              uploadToVault(answer);
            } else {
              setAiResponse("AI returned an empty answer.");
              uploadToVault("");
            }
          } else {
            setAiResponse("Failed to get an answer. Unknown error.");
            console.log("Full response:", data);
          }
        } catch (error) {
          console.error("Error asking Gemini:", error);
          setAiResponse(`Connection Error: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
    };

    // Start AI Analysis first; it will call uploadToVault when finished!
    analyzeImageAutomatically();
  }, [geminiFile]);

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>📤 Document Management</h2>
      <p style={{ color: '#64748b' }}>Choose how you want to process your documents.</p>

      {/* --- OPTION 2 UI --- */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3>Gemini AI Image Analysis</h3>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
          Upload a file from your device to get a detailed AI analysis.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type='button' onClick={openFiles} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Upload from device
            </button>
            <input 
              type="file" 
              ref={fileRef} 
              onChange={handleGeminiFileChange} 
              accept='image/*, application/pdf' 
              style={{ display: 'none' }} // Hidden because the button triggers it
            />

            <button type='button' onClick={openCamera} style={{ padding: '10px 20px', backgroundColor: '#15803d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Take Picture
            </button>
            <input 
              type="file" 
              ref={cameraRef} 
              onChange={handleGeminiFileChange} 
              accept='image/*' 
              capture='environment'
              style={{ display: 'none' }}
            />
        </div>

        {geminiFile && (
          <div style={{ marginTop: '20px' }}>
            <img src={URL.createObjectURL(geminiFile)} alt="preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            
            <div style={{ 
              marginTop: "24px", 
              padding: "24px", 
              backgroundColor: "#ffffff", 
              borderRadius: "12px", 
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              color: "#0f172a" 
            }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2563eb', fontWeight: '500' }}>
                  <span style={{ fontSize: '24px', animation: 'spin 2s linear infinite' }}>🤖</span> 
                  <span>AI is carefully analyzing your medical document...</span>
                </div>
              ) : aiResponse ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>📋</span>
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Medical AI Analysis Report</h4>
                  </div>
                  <div style={{ fontSize: '15px' }}>
                    {formatAIResponse(aiResponse)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default DocumentUpload;