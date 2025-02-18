import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [players, setPlayers] = useState([]);

  // const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;
  const fruitsAddress = `${serverAddress}api`;
  const playerAddress = `${serverAddress}players`;

  const fetchAPI = async () => {
    try {
      // const bruh = await axios.get(fruitsAddress);

      // if (bruh.data.fruits == undefined)
      //   console.log("bruh ts undefined");
      // else {
      //   console.log(bruh.data.fruits);
      //   setArray(bruh.data.fruits);
      // }

      const ok = await axios.get(playerAddress);
      console.log(ok.data);
      setPlayers(ok.data);
      
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
        {/* {
          array.map((fruit, index) => {
            return (
              <div key={index}>
                <p>{fruit}</p>
                <br></br>
              </div>
            )
          })
        } */}
        {
          players.map((player, index) => {
            return (
              <div key={index}>
                <p>{player}</p>
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
