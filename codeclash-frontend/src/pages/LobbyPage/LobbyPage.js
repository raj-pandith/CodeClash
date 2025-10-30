import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/style";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ROOM_API_BASE_URL } from "../../api/apis";
import axios from "axios";
import { Navigate } from "react-router-dom";

function LobbyPage({ roomData, setRoomData, currentUser }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // --- MODIFIED: Settings for starting the game ---
  // These now match your new API request body
  const [numEasy, setNumEasy] = useState(1);
  const [numMedium, setNumMedium] = useState(1);
  const [numHard, setNumHard] = useState(1);

  // Ref to hold the STOMP client
  const stompClientRef = useRef(null);

  // --- (WebSocket useEffect... NO CHANGES NEEDED) ---
  useEffect(() => {
    // Only connect if we have room data and aren't already connected
    if (roomData && roomData.roomCode && !stompClientRef.current) {
      
      // 1. Create a new SockJS connection to your backend endpoint
      const socket = new SockJS(`${ROOM_API_BASE_URL}/ws`);
      
      // 2. Create a STOMP client over the SockJS connection
      const client = Stomp.over(socket);
      
      // Disable debug messages in production
      // client.debug = () => {};

      // 3. Store the client in the ref
      stompClientRef.current = client;

      // 4. Connect to the WebSocket server
      client.connect(
        {}, // No headers
        (frame) => { // onConnect callback
          console.log('WebSocket Connected: ' + frame);

          // 5. Subscribe to player updates
          client.subscribe(`/topic/${roomData.roomCode}/players`, (message) => {
            const updatedPlayers = JSON.parse(message.body);
            console.log('Received player update:', updatedPlayers);
            setRoomData(prevData => ({ ...prevData, players: updatedPlayers }));
          });

          // 6. Subscribe to game start
          client.subscribe(`/topic/${roomData.roomCode}/start`, (message) => {
            const updatedRoom = JSON.parse(message.body);
            console.log('Received game start message:', updatedRoom);
            setRoomData(updatedRoom); // Set the full room data
            navigate('/game'); // Navigate to the game page
          });
        },
        (error) => { // onError callback
          console.error('WebSocket Error:', error);
          setError('Connection lost. Please try rejoining.');
        }
      );
    }

    // 7. Cleanup function: Disconnect when the component unmounts
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('WebSocket Disconnected');
        });
        stompClientRef.current = null;
      }
    };
  }, [roomData, setRoomData, navigate]);


  // --- MODIFIED: Handle starting the game (host only) ---
  const handleStartGame = async (e) => {
    e.preventDefault();
    
    // Create the new request body object
    const contestSettings = {
      easy: numEasy,
      medium: numMedium,
      hard: numHard
    };

    // Ensure at least one question is selected
    if (contestSettings.easy + contestSettings.medium + contestSettings.hard === 0) {
        setError('Please select at least one question.');
        return;
    }
    setError(''); // Clear any previous error

    try {
      // We still call the same /room/start endpoint,
      // but we send the new contestSettings object as the body.
      const resp=await axios.post(
        `${ROOM_API_BASE_URL}/room/start?roomCode=${roomData.roomCode}`,
        contestSettings // Send the new body
      );
      console.log("response after setting  Quest :")
      console.log(resp)
      // The WebSocket listener will handle the navigation to /game
    } catch (err) {
      setError('Failed to start the game.');
      console.error(err);
    }
  };

  // Guard clause: If there's no room data, redirect to home
  if (!roomData) {
    return <Navigate to="/" replace />;
  }

  const isHost = currentUser === roomData.host;
  const isWaiting = roomData.status === 'waiting';

  return (
    <div style={styles.container}>
      {/* ... (Lobby info and Player list... NO CHANGES) ... */}
      <h2 style={styles.header}>Lobby</h2>
      <div style={styles.lobbyInfo}>
        <p>Room Code: <strong style={styles.roomCode}>{roomData.roomCode}</strong></p>
        <p>Host: {roomData.host}</p>
        <p>Status: {roomData.status}</p>
      </div>

      <h3>Players ({roomData.players.length}):</h3>
      <ul style={styles.list}>
        {roomData.players.map(player => (
          <li key={player} style={styles.listItem}>
            {player} {player === currentUser ? '(You)' : ''} {player === roomData.host ? '👑' : ''}
          </li>
        ))}
      </ul>

      {/* --- MODIFIED: Host-only "Start Game" Form --- */}
      {isHost && isWaiting && (
        <form onSubmit={handleStartGame} style={{ ...styles.form, marginTop: '20px' }}>
          <h3 style={styles.header}>Contest Settings</h3>
          <label>
            Number of Easy Questions:
            <input
              type="number"
              value={numEasy}
              onChange={(e) => setNumEasy(parseInt(e.target.value) || 0)}
              style={styles.input}
              min="0"
            />
          </label>
          <label>
            Number of Medium Questions:
            <input
              type="number"
              value={numMedium}
              onChange={(e) => setNumMedium(parseInt(e.target.value) || 0)}
              style={styles.input}
              min="0"
            />
          </label>
          <label>
            Number of Hard Questions:
            <input
              type="number"
              value={numHard}
              onChange={(e) => setNumHard(parseInt(e.target.value) || 0)}
              style={styles.input}
              min="0"
            />
          </label>
          <button type="submit" style={styles.button}>Start Game</button>
        </form>
      )}
      {/* ... (Waiting message and error... NO CHANGES) ... */}
      {!isHost && isWaiting && (
        <p>Waiting for the host ({roomData.host}) to start the game...</p>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

export default LobbyPage;