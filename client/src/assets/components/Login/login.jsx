import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import '../../../styles/retro.css'
import axios from 'axios'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Colors matching download page
  const colors = {
    primary: '#FF8032',     // Orange color
    background: '#2A2A2A',  // Darker background - matching download page
    text: '#E0E0E0',        // Light text - matching download page
    textSecondary: '#BBBBBB', // Secondary text - matching download page
    accent: '#FF8032',      // Same orange as primary
    hover: '#FF9A5E',       // Lighter orange for hover
    dark: '#202020',        // Darker shade
    card: '#333333',        // Card background
    cardHover: '#404040'    // Card hover
  };

  // API address from environment
  const apiAddress = import.meta.env.VITE_SERVER_ADDRESS

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const credentials = {
        email: formData.email,
        pass: formData.password,
        tid: "t" + Math.floor(Math.random() * 1000) // Generate random tid
      }

      // Send login request
      const loginResponse = await axios.post(`${apiAddress}/users/login`, credentials, { 
        withCredentials: true // Important for cookies
      })
      
      console.log("Login successful:", loginResponse.status)
      
      // Store the access token in localStorage
      localStorage.setItem('accessToken', loginResponse.data.accessToken)
      
      // Redirect based on user type
      setIsLoading(false)
      navigate(isCreator ? '/provider' : '/download')
    } catch (error) {
      setIsLoading(false)
      console.error("Login error:", error)
      
      // Display appropriate error message
      if (error.response) {
        if (error.response.status === 400) {
          setError('User not found. Please check your email.')
        } else if (error.response.status === 401) {
          setError('Incorrect password. Please try again.')
        } else {
          setError('Login failed. Please try again later.')
        }
      } else {
        setError('Network error. Please check your connection.')
      }
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const toggleUserType = () => {
    setIsCreator(prev => !prev)
  }

  // Custom input style to apply to all inputs
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker input background to match download page
    border: '1px solid rgba(255, 255, 255, 0.05)', // Border to match download page
    borderRadius: '6px',
    color: colors.text,
    fontSize: '16px',
    fontFamily: 'monospace',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background, // Updated to match download page
        fontFamily: 'monospace',
        overflow: 'auto',
        padding: '20px',
        color: colors.text
      }}
    >
      {/* Logo in top left */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20 }}>
        <h1 className="text-4xl font-bold text-white opacity-20 tracking-wider glitch">BIMLAR</h1>
      </div>

      {/* Background grid and glow - Updated to match download page */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-orange-500 to-orange-700 opacity-20 blur-[100px]" />
      </div>

      {/* Login Form - Centered */}
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '32px 36px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Added brain icon matching signup page */}
          <svg 
            style={{ 
              width: '64px', 
              height: '64px', 
              color: colors.primary, 
              margin: '0 auto 20px',
              filter: 'drop-shadow(0 0 8px rgba(255, 128, 50, 0.5))'
            }}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
          </svg>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: 'white',
            letterSpacing: '0.5px'
          }}>
            Login to Your Account
          </h2>
          <p style={{ color: colors.textSecondary, fontSize: '15px' }}>
            Welcome back to BIMLAR
          </p>
        </div>

        {/* User type toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginBottom: '24px' 
        }}>
          <button 
            type="button"
            onClick={() => !isCreator && toggleUserType()}
            style={{ 
              padding: '8px 16px',
              backgroundColor: !isCreator ? 'rgba(255, 128, 50, 0.1)' : 'transparent',
              border: !isCreator ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: !isCreator ? colors.primary : colors.textSecondary,
              fontWeight: !isCreator ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            User
          </button>
          <button 
            type="button"
            onClick={() => isCreator && toggleUserType()}
            style={{ 
              padding: '8px 16px',
              backgroundColor: isCreator ? 'rgba(255, 128, 50, 0.1)' : 'transparent',
              border: isCreator ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: isCreator ? colors.primary : colors.textSecondary,
              fontWeight: isCreator ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Creator
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <label 
              htmlFor="email" 
              style={{ 
                color: colors.text, 
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                marginLeft: '4px'
              }}
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <label 
              htmlFor="password" 
              style={{ 
                color: colors.text, 
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                marginLeft: '4px'
              }}
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 0',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(255, 128, 50, 0.3)',
              letterSpacing: '0.5px'
            }}
          >
            {isLoading ? 'Logging in...' : `Login as ${isCreator ? 'Creator' : 'User'}`}
          </button>
        </form>

        {error && (
          <p style={{ 
            color: '#ff6b6b', 
            marginTop: '10px', 
            textAlign: 'center',
            fontSize: '14px' 
          }}>
            {error}
          </p>
        )}

        <p style={{ 
          marginTop: '28px', 
          textAlign: 'center', 
          fontSize: '15px', 
          color: colors.textSecondary
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ 
            color: colors.hover,
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'color 0.2s',
            textShadow: '0 0 12px rgba(255, 128, 50, 0.5)'
          }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}