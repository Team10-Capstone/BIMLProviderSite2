'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Waves } from 'lucide-react'
import Link from 'next/link'
import { getPath } from '@/utils/paths'

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Here you would typically handle the login logic and navigation
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-mono">
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-4xl font-bold text-white opacity-20 tracking-wider glitch" 
            style={{ textShadow: '2px 2px #ff00ff, -2px -2px #00ffff' }}>
          BIMLAR
        </h1>
      </div>
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-[100px] z-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/90 p-8 rounded-lg backdrop-blur-sm">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled={isLoading}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              disabled={isLoading}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href={getPath('/register')} className="text-purple-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Brain className="absolute inset-0" />
      <Waves className="absolute inset-0" />
    </div>
  )
}