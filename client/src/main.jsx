import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <div className="min-h-screen flex flex-col">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
)
