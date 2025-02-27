'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Form submitted:', formData)
    setIsLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] relative overflow-hidden font-mono">
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-4xl font-bold text-white opacity-20 tracking-wider glitch">BIMLAR</h1>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
          <div className="flex justify-center mb-8 relative h-16 w-16 mx-auto">
            {/* Brain Icon */}
            <svg 
              className="absolute inset-0 w-full h-full text-purple-500 scale-110"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
            </svg>
            {/* Waves Icon */}
            <svg 
              className="absolute inset-0 w-full h-full text-purple-500 opacity-70 scale-90"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-4">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">Example slogan here or something</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes glitch {
          0% {
            text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff;
          }
          25% {
            text-shadow: -2px -2px #ff00ff, 2px 2px #00ffff;
          }
          50% {
            text-shadow: 2px -2px #ff00ff, -2px 2px #00ffff;
          }
          75% {
            text-shadow: -2px 2px #ff00ff, 2px -2px #00ffff;
          }
          100% {
            text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff;
          }
        }

        .glitch {
          animation: glitch 5s infinite;
        }
      `}</style>
    </div>
  )
}