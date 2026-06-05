import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FolderOpen, 
  Upload, 
  Activity, 
  MessageSquare, 
  Clock, 
  User 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home({ onNavigate }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ name: "Guest" });
  const [documentCount, setDocumentCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        if (parsedUser && parsedUser.id && parsedUser.name) {
          setCurrentUser(parsedUser);
          
          // Fetch exact document count for the user
          axios.get(`https://health-management-e61z.onrender.com/api/documents/user/${parsedUser.id}`)
            .then(res => {
              setDocumentCount(res.data.length);
            })
            .catch(err => {
              console.error("Error fetching documents:", err);
            });
        } else {
          // Invalid or incomplete user data
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      // No user in local storage
      navigate("/login");
    }
  }, [navigate]);

  // Helper function to handle navigation safely
  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(`/${path}`);
    }
  };

  const nextAppointment = "May 24, 2026"; // Mock appointment

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.welcome}>Welcome back, {currentUser.name}</h1>
          <p style={styles.subtitle}>Your AI-Powered Personal Health Portfolio</p>
        </div>
        <div style={styles.profileBadge} onClick={() => setShowProfile(true)}>
          <User size={20} />
          <span>Profile</span>
        </div>
      </header>

      {/* Critical Alert Banner (Dynamic Next Appointment Reminder) */}
      <div style={styles.alertBanner}>
        <Clock size={20} style={{ marginRight: '10px' }} />
        <span><strong>Upcoming Consultation:</strong> Your AI detected a suggested follow-up appointment on <strong>{nextAppointment}</strong>. An email reminder will be sent 3 days prior.</span>
      </div>

      {/* Main Grid Options */}
      <div style={styles.grid}>
        
        {/* Option 1: File & Prescription Management */}
        <div style={styles.card} onClick={() => handleNav('vault')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#e0f2fe' }}>
            <FolderOpen size={28} color="#0369a1" />
          </div>
          <h3 style={styles.cardTitle}>Medical Digital Vault</h3>
          <p style={styles.cardDesc}>Maintain, view, and organize all your prescriptions, lab reports, and doctor files chronologically.</p>
          <span style={styles.badge}>{documentCount} Files Saved</span>
        </div>

        {/* Option 2: Upload & Smart Scan */}
        <div style={styles.card} onClick={() => handleNav('upload')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#dcfce7' }}>
            <Upload size={28} color="#15803d" />
          </div>
          <h3 style={styles.cardTitle}>Upload & Smart Scan</h3>
          <p style={styles.cardDesc}>Take a picture of a new prescription with your phone camera. Our AI will automatically parse the text.</p>
        </div>

        {/* Option 3: Health Statistics */}
        <div style={styles.card} onClick={() => handleNav('stats')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#fef3c7' }}>
            <Activity size={28} color="#b45309" />
          </div>
          <h3 style={styles.cardTitle}>Health Statistics</h3>
          <p style={styles.cardDesc}>Monitor and track key health metrics (Blood Pressure, Glucose, etc.) graphed directly from your uploaded files.</p>
        </div>

        {/* Option 4: Symptom Checker & Specialist Finder */}
        <div style={styles.card} onClick={() => handleNav('symptoms')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#fce7f3' }}>
            <MessageSquare size={28} color="#b91c1c" />
          </div>
          <h3 style={styles.cardTitle}>Symptom Triage Chat</h3>
          
        </div>

      </div>

      {showProfile && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Profile Details</h2>
            <div style={{ margin: '15px 0', lineHeight: '1.6', color: '#334155' }}>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
            <button style={styles.closeBtn} onClick={() => setShowProfile(false)}>Close</button>
            <button style={{...styles.closeBtn, backgroundColor: '#ef4444', marginLeft: '10px'}} onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple and clean inline styles
const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  welcome: {
    fontSize: '28px',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    color: '#64748b',
    marginTop: '5px',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1e40af',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '30px',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    }
  },
  iconContainer: {
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#1e293b',
    margin: '0 0 10px 0',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '0 0 15px 0',
    flexGrow: 1,
  },
  badge: {
    fontSize: '12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  alertBadge: {
    fontSize: '12px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '320px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  closeBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Home;