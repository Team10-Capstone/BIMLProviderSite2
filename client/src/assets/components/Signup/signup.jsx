import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import '../../../styles/retro.css'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
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

      <div className="w-full max-w-md mx-auto px-6">
        <div className="relative z-10 bg-[#1b2133]/50 backdrop-blur-sm p-8 rounded-lg border border-[#ffffff10] shadow-xl">
          <div className="flex justify-center items-center mb-6">
            <svg 
              className="w-12 h-12 text-[#b760ea]"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              style={{ maxWidth: '48px', maxHeight: '48px' }}
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-4">Create Account</h2>
          <p className="text-gray-400 text-center mb-8">Join our community today</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="name" className="block text-sm font-mono text-[#8b8d91]">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-4">
              <label htmlFor="email" className="block text-sm font-mono text-[#8b8d91]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-4">
              <label htmlFor="password" className="block text-sm font-mono text-[#8b8d91]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#b760ea] hover:bg-[#b760ea]/90 text-white font-mono py-3 rounded mt-8"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}