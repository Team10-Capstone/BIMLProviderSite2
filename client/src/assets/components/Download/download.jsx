import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../../styles/retro.css'
import axios from 'axios'

export default function DownloadPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  // Updated color scheme with orange primary color
  const colors = {
    primary: '#FF8032',     // Orange color from your reference
    background: '#2A2A2A',  // Darker background
    text: '#E0E0E0',        // Light text
    textSecondary: '#BBBBBB', // Secondary text
    accent: '#FF8032',      // Same orange as primary
    hover: '#FF9A5E',       // Lighter orange for hover
    dark: '#202020',        // Darker shade
    card: '#333333',        // Card background
    cardHover: '#404040'    // Card hover
  };
  
  // API address from environment
  const apiAddress = import.meta.env.VITE_SERVER_ADDRESS;

  useEffect(() => {
    // Check if user is logged in by verifying token
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      // Redirect to login if no token exists
      navigate('/login');
      return;
    }
    
    // Extract user info directly from token
    try {
      // Get user info from JWT token (basic parsing, no verification needed)
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log("Token payload:", tokenPayload);
      
      // Set username from the token - try useremail first, then try email
      if (tokenPayload.useremail) {
        const email = tokenPayload.useremail;
        setUserName(email.split('@')[0]);
      } else if (tokenPayload.email) {
        const email = tokenPayload.email;
        setUserName(email.split('@')[0]);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    
    // Verify token with server as backup
    const getUserInfo = async () => {
      try {
        const response = await axios.post(`${apiAddress}/users/login/test`, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        console.log("Server response:", response.data);
        
        // Only set username if not already set from token
        if (!userName && response.data && response.data.length > 0) {
          setUserName(response.data[0].email.split('@')[0]);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        // Don't redirect here, since we already got info from token
      }
    };
    
    getUserInfo();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // Call logout endpoint
      await axios.delete(`${apiAddress}/users/logout`, {
        data: { token: accessToken },
        withCredentials: true
      });
      
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "What is BIMLAR?",
      answer: "BIMLAR is an advanced AR/VR training platform designed to help physical therapists and patients visualize and execute exercises correctly through mixed reality technology."
    },
    {
      id: 2,
      question: "Do I need special hardware?",
      answer: "For the best experience, we recommend using a compatible AR headset. However, many features can be accessed using just your smartphone or tablet device."
    },
    {
      id: 3,
      question: "How do I set up the Unity application?",
      answer: "After downloading the Unity application, run the installer and follow the on-screen instructions. Once installed, log in with the same credentials you used on this website."
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer: "Yes. All data is encrypted and stored securely. We comply with healthcare data regulations including HIPAA requirements."
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        fontFamily: 'monospace',
        overflow: 'auto',
        padding: '20px',
        color: colors.text
      }}
    >
      {/* Background grid and glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-orange-500 to-orange-700 opacity-20 blur-[100px]" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
        {/* Header with Logo and Welcome Message */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              margin: 0,
              color: colors.primary,
              letterSpacing: '1px'
            }}>
              BIMLAR
            </h1>
          </div>
          
          {/* User welcome message */}
          {userName && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 128, 50, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#fff'
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: colors.text }}>Welcome, {userName}</span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ 
          padding: '30px', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          borderRadius: '12px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.05)',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: colors.primary
          }}>
            Download BIMLAR
          </h1>
          
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '20px',
            lineHeight: 1.6,
            color: colors.textSecondary
          }}>
            Get started with BIMLAR by downloading our application for your operating system.
            After installation, simply login with your account credentials to begin.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginTop: '20px'
          }}>
            <a 
              href="#download-windows" 
              style={{
                backgroundColor: colors.primary,
                color: '#000',
                padding: '14px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 128, 50, 0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download for Windows
            </a>
            
            <a 
              href="#download-mac" 
              style={{
                backgroundColor: 'transparent',
                color: colors.primary,
                padding: '14px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `1px solid ${colors.primary}`,
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download for Mac
            </a>
          </div>
        </div>

        {/* FAQ section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: colors.text
          }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map(faq => (
              <div 
                key={faq.id}
                style={{
                  backgroundColor: expandedFaq === faq.id ? colors.cardHover : colors.card,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${colors.dark}`
                }}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: 'transparent',
                    color: colors.text,
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {faq.question}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={colors.primary}
                    strokeWidth="2"
                    style={{
                      transform: expandedFaq === faq.id ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                
                {expandedFaq === faq.id && (
                  <div style={{
                    padding: '0 20px 16px 20px',
                    color: colors.textSecondary,
                    lineHeight: 1.6,
                    fontSize: '15px'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Updated navigation buttons with orange color */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px',
          marginTop: '30px'
        }}>
          <Link 
            to="/provider" 
            style={{ 
              color: colors.primary, 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background 0.2s ease',
              backgroundColor: 'rgba(255, 128, 50, 0.1)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Go to Dashboard
          </Link>
          
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(255, 128, 50, 0.1)',
              border: 'none',
              color: colors.primary, 
              padding: '8px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: 'inherit',
              transition: 'background 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
