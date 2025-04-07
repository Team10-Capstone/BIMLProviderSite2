import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../../styles/retro.css'
import axios from 'axios'

export default function DownloadPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [userName, setUserName] = useState('');
  const [isDownloading, setIsDownloading] = useState({ windows: false, mac: false });
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
  
  // S3 download URLs - these can be easily updated later
  // Currently pointing to placeholder images, will be updated to actual app builds
  const downloadUrls = {
    windows: `${apiAddress}/download/windows`,
    mac: `${apiAddress}/download/mac`
  };

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
      
      // Set username from the token - try useremail first, then try email
      if (tokenPayload.useremail) {
        const email = tokenPayload.useremail;
        setUserName(email.split('@')[0]);
      } else if (tokenPayload.email) {
        const email = tokenPayload.email;
        setUserName(email.split('@')[0]);
      }
    } catch (error) {
      console.error("Error decoding token");
    }
    
    // Verify token with server as backup
    const getUserInfo = async () => {
      try {
        const response = await axios.post(`${apiAddress}/users/login/test`, {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        // Only set username if not already set from token
        if (!userName && response.data && response.data.length > 0) {
          setUserName(response.data[0].email.split('@')[0]);
        }
      } catch (error) {
        console.error("Error verifying token");
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
      question: "What is STRIDE?",
      answer: "STRIDE is a cutting-edge physical therapy application designed to help therapists and patients track progress, perform exercises correctly, and achieve better outcomes through AI-assisted movement analysis."
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

  // Handle file download
  const handleDownload = async (platform) => {
    try {
      setIsDownloading({ ...isDownloading, [platform]: true });
      
      // Get the download URL for the selected platform
      const downloadUrl = downloadUrls[platform];
      
      // Make a request to the download endpoint
      const response = await axios.get(downloadUrl, {
        responseType: 'blob', // Important for file downloads
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      // Create a blob URL for the downloaded file
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename based on platform
      const filename = platform === 'windows' 
        ? 'STRIDE-Setup.exe' 
        : 'STRIDE-Installer.dmg';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setIsDownloading({ ...isDownloading, [platform]: false });
    } catch (error) {
      console.error(`Error downloading ${platform} version:`, error);
      setIsDownloading({ ...isDownloading, [platform]: false });
      
      // You could add error handling UI here if needed
      alert(`Download failed. Please try again later.`);
    }
  };

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
              fontSize: '24px', 
              fontWeight: 'bold',
              margin: 0,
              color: colors.primary,
              letterSpacing: '1px',
              fontFamily: "'SANDRE - Regular', 'Arial', sans-serif"
            }}>
              STRIDE
            </h1>
          </div>
          
          {/* User welcome message and signout button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {userName && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 128, 50, 0.1)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 128, 50, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', color: colors.text }}>
                    Welcome{userName ? `, ${userName}` : ''}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textSecondary }}>
                    Thanks for using STRIDE
                  </p>
                </div>
              </div>
            )}
            
            {/* Sign Out Button */}
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255, 128, 50, 0.1)',
                color: colors.primary,
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 128, 50, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 128, 50, 0.1)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
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
            Download STRIDE
          </h1>
          
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '20px',
            lineHeight: 1.6,
            color: colors.textSecondary
          }}>
            Get started with STRIDE by downloading our application for your operating system.
            After installation, simply login with your account credentials to begin.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginTop: '20px'
          }}>
            <button 
              onClick={() => handleDownload('windows')}
              disabled={isDownloading.windows}
              style={{
                backgroundColor: colors.primary,
                color: '#000',
                padding: '14px 24px',
                borderRadius: '8px',
                border: 'none',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 128, 50, 0.3)',
                cursor: isDownloading.windows ? 'wait' : 'pointer',
                opacity: isDownloading.windows ? 0.8 : 1
              }}
            >
              {isDownloading.windows ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="8" fill="none" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download for Windows
                </>
              )}
            </button>
            
            <button 
              onClick={() => handleDownload('mac')}
              disabled={isDownloading.mac}
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
                transition: 'all 0.2s ease',
                cursor: isDownloading.mac ? 'wait' : 'pointer',
                opacity: isDownloading.mac ? 0.8 : 1
              }}
            >
              {isDownloading.mac ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="8" fill="none" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download for Mac
                </>
              )}
            </button>
          </div>
        </div>

        {/* FAQ section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
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
      </div>
    </div>
  )
}
