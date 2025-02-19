import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  //array contains the frutis returned by /api, players contains array of names of players from db
  const [playerNames, setPlayerNames] = useState([]);
  const [player, setPlayer] = useState();
  const [recordings, setRecordings] = useState([]);

  // sets addresses to node server
  const apiAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const fetchAPI = async () => {
    try {
      const recordingS = await axios.get(`${apiAddress}/patient/recordings/p001`);
      setRecordings(recordingS.data);
    } catch (error) {
      console.error("error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        {
          recordings.map((recording, index) => {
            return (
              <div key={index}>
                <p>Name: {recording.fld_r_name}</p>
                <p>Address: {recording.fld_r_address}</p>
                <p>Date: {recording.fld_r_date}</p>
              </div>
            )
          })
        }
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
