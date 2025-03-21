import { Routes, Route } from 'react-router-dom'
import LoginPage from './assets/components/Login/login'
import SignupPage from './assets/components/Signup/signup'
import { useState, useEffect } from 'react'
import axios from "axios";

export default function App() {
  const [count, setCount] = useState(0);
  //array contains the frutis returned by /api, players contains array of names of players from db
  const [playerNames, setPlayerNames] = useState([]);
  const [player, setPlayer] = useState();
  const [recordings, setRecordings] = useState([]);

  // sets addresses to node server
  const apiAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const fetchAPI = async () => {
    try {
      

    } catch (error) {
      console.error("error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

