import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import '../../../styles/retro.css'
import axios from "axios"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const apiAddress = import.meta.env.VITE_SERVER_ADDRESS

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const request = {
      email: formData.email,
      pass: formData.password,
      provider: isCreator,
      name: formData.name
    }

    const testResponse = await axios.post(`${apiAddress}/users/register`, request, {
      headers: { "Content-Type": "application/json"
      }
    })
    
    console.log('Form submitted:', formData, 'Account type:', isCreator ? 'Creator' : 'User')
    setIsLoading(false)

    // Redirect to login after successful signup
    window.location.href = '/login';
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const toggleUserType = () => {
    setIsCreator(prev => !prev);
  }

  // Custom input style to apply to all inputs
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(15, 20, 34, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontFamily: 'monospace',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  };

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
        backgroundColor: '#111827',
        fontFamily: 'monospace'
      }}
    >
      {/* Logo in top left */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20 }}>
        <h1 className="text-4xl font-bold text-white opacity-20 tracking-wider glitch">BIMLAR</h1>
      </div>

      {/* Background grid and glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-[100px]" />
      </div>

      {/* Signup Form - Centered */}
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '32px 36px',
        backgroundColor: 'rgba(27, 33, 51, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg 
            style={{ 
              width: '64px', 
              height: '64px', 
              color: '#b760ea', 
              margin: '0 auto 20px',
              filter: 'drop-shadow(0 0 8px rgba(183, 96, 234, 0.5))'
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
            Create an Account
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            Join our community of physical therapy professionals
          </p>
        </div>

        {/* User Type Toggle */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '24px',
          backgroundColor: 'rgba(15, 20, 34, 0.6)',
          borderRadius: '6px',
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            type="button"
            onClick={toggleUserType}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: isCreator ? 'transparent' : 'rgba(183, 96, 234, 0.5)',
              color: isCreator ? '#a1a1aa' : 'white',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            User
          </button>
          <button
            type="button"
            onClick={toggleUserType}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: isCreator ? 'rgba(183, 96, 234, 0.5)' : 'transparent',
              color: isCreator ? 'white' : '#a1a1aa',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Creator
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label 
              htmlFor="name" 
              style={{ 
                color: '#d1d5db', 
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                marginLeft: '4px'
              }}
            >
              NAME
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label 
              htmlFor="email" 
              style={{ 
                color: '#d1d5db', 
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
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label 
              htmlFor="password" 
              style={{ 
                color: '#d1d5db', 
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
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 0',
              backgroundColor: '#b760ea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'wait' : 'pointer',
              marginTop: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(183, 96, 234, 0.3)',
              letterSpacing: '0.5px'
            }}
          >
            {isLoading ? 'Creating account...' : `Sign up as ${isCreator ? 'Creator' : 'User'}`}
          </button>
        </form>

        <p style={{ 
          marginTop: '28px', 
          textAlign: 'center', 
          fontSize: '15px', 
          color: '#b8bfd0' 
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ 
            color: '#c490fd', 
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'color 0.2s',
            textShadow: '0 0 12px rgba(196, 144, 253, 0.5)'
          }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}