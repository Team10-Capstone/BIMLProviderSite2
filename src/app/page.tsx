import Link from 'next/link'
import { getPath } from '@/utils/paths'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="space-y-4">
        <Link 
          href={getPath('/login')}
          className="block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Login
        </Link>
        <Link 
          href={getPath('/register')}
          className="block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Register
        </Link>
      </div>
    </div>
  )
}
