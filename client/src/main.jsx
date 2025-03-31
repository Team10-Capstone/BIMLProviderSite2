import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './assets/components/Login/login.jsx'
import SignupPage from './assets/components/Signup/signup.jsx'
import ProviderPage from './assets/components/Provider/provider.jsx'
import DownloadPage from './assets/components/Download/download.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/provider',
    element: <ProviderPage />,
  },
  {
    path: '/download',
    element: <DownloadPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
