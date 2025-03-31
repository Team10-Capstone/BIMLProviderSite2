import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../../styles/retro.css'

export default function DownloadPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

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
      question: "Can I create custom exercise programs?",
      answer: "Yes! Creators can design and publish custom exercise programs through our platform, which patients can then access and follow through the Unity application."
    },
    {
      id: 5,
      question: "How can I track patient progress?",
      answer: "Providers can track detailed analytics on patient adherence, progress, and performance through the provider dashboard after patients complete exercises."
    }
  ];

  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
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
        backgroundColor: '#111827',
        fontFamily: 'monospace',
        overflow: 'auto',
        padding: '20px'
      }}
    >
      {/* Background grid and glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-[100px]" />
      </div>

      {/* Logo in top left */}
      <div style={{ position: 'relative', zIndex: 10, margin: '0 0 30px 0' }}>
        <h1 className="text-4xl font-bold text-white tracking-wider glitch">BIMLAR</h1>
      </div>

      <div style={{ 
        position: 'relative',
        zIndex: 10,
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'rgba(27, 33, 51, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
            Welcome to BIMLAR
          </h2>
          <p style={{ fontSize: '16px', color: '#b8bfd0', marginBottom: '24px', lineHeight: 1.6 }}>
            You're now ready to get started with our advanced AR/VR platform for physical therapy and rehabilitation. 
            Download our Unity application to begin your immersive training experience.
          </p>
          
          <a 
            href="https://unity.com/download" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              backgroundColor: '#b760ea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'none',
              marginTop: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(183, 96, 234, 0.3)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download Unity Application
            </span>
          </a>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: 'rgba(27, 33, 51, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          padding: '30px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map(faq => (
              <div 
                key={faq.id}
                style={{
                  backgroundColor: expandedFaq === faq.id ? 'rgba(183, 96, 234, 0.1)' : 'rgba(15, 20, 34, 0.3)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: 'transparent',
                    color: 'white',
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
                    stroke="currentColor" 
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
                    color: '#b8bfd0',
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

        {/* Navigation buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px',
          marginTop: '10px'
        }}>
          <Link 
            to="/provider" 
            style={{ 
              color: '#c490fd', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Go to Dashboard
          </Link>
          
          <Link 
            to="/login" 
            style={{ 
              color: '#c490fd', 
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </div>
  )
}
