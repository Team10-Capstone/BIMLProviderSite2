import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './assets/components/Login/login.jsx'
import SignupPage from './assets/components/Signup/signup.jsx'
import ExercisesPage from './assets/components/Exercises/exercises.jsx'
import ProviderPage from './assets/components/Provider/provider.jsx'
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
    path: '/exercises',
    element: <ExercisesPage />,
  },
  {
    path: '/provider',
    element: <ProviderPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
