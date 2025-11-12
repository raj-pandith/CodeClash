import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Import both API URLs
import { ROOM_API_BASE_URL, QUESTION_API_BASE_URL } from "../../api/apis";
import axios from "axios";
import { Navigate } from "react-router-dom";
// Import the expanded styles
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import lobbyStyles from "./style/lobbyStyle";

function LobbyPage({ roomData, setRoomData, currentUser }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Settings for 'Random' mode ---
  const [numEasy, setNumEasy] = useState(1);
  const [numMedium, setNumMedium] = useState(1);
  const [numHard, setNumHard] = useState(1);

  // --- State for 'Manual' mode ---
  const [selectionMode, setSelectionMode] = useState('random'); // 'random' or 'manual'
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Stores question *numbers*
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Ref to hold the STOMP client
  const stompClientRef = useRef(null);

  // --- WebSocket useEffect (No Changes) ---
  useEffect(() => {
    if (roomData && roomData.roomCode && !stompClientRef.current) {
      const socket = new SockJS(`${ROOM_API_BASE_URL}/ws`);
      const client = Stomp.over(socket);
      stompClientRef.current = client;

      client.connect(
        {},
        (frame) => {
          // Subscribe to player updates
          client.subscribe(`/topic/${roomData.roomCode}/players`, (message) => {
            const updatedPlayers = JSON.parse(message.body);
            setRoomData(prevData => ({ ...prevData, players: updatedPlayers }));
          });
          
          // Subscribe to game start
          client.subscribe(`/topic/${roomData.roomCode}/start`, (message) => {
            const updatedRoom = JSON.parse(message.body);
            console.log('Received game start message:', updatedRoom);
            setRoomData(updatedRoom);
            navigate('/game'); // This handles navigation
          });
        },
        (error) => {
          console.error('WebSocket Error:', error);
          setError('Connection lost. Please try rejoining.');
        }
      );
    }
    
    // Cleanup on unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('WebSocket Disconnected');
        });
        stompClientRef.current = null;
      }
    };
  }, [roomData, setRoomData, navigate]);

  // --- useEffect to fetch questions for 'Manual' mode (No Changes) ---
  useEffect(() => {
    if (selectionMode === 'manual' && allQuestions.length === 0) {
      const fetchQuestions = async () => {
        setIsLoadingQuestions(true);
        setFetchError('');
        try {
          const response = await axios.get(`${QUESTION_API_BASE_URL}/questions/all-questions`);
          setAllQuestions(response.data);
        } catch (err) {
          console.error("Failed to fetch questions:", err);
          setFetchError('Could not load questions. Please try again.');
        } finally {
          setIsLoadingQuestions(false);
        }
      };
      fetchQuestions();
    }
  }, [selectionMode, allQuestions.length]);


  // --- Handler for toggling a question checkbox (No Changes) ---
  const handleQuestionToggle = (questionNumber) => {
    setSelectedQuestions(prevSelected => {
      if (prevSelected.includes(questionNumber)) {
        return prevSelected.filter(num => num !== questionNumber);
      } else {
        return [...prevSelected, questionNumber];
      }
    });
  };

  // --- CORRECTED: Handle starting the game (host only) ---
  const handleStartGame = async (e) => {
    e.preventDefault();
    setError('');

    let requestBody;

    if (selectionMode === 'random') {
      // --- Logic for 'Random' mode ---
      const totalQuestions = numEasy + numMedium + numHard;
      if (totalQuestions === 0) {
        setError('Please select at least one question.');
        return;
      }
      requestBody = {
        selectionMode: "RANDOM",
        difficultySettings: {
          easy: numEasy,
          medium: numMedium,
          hard: numHard
        }
      };
    } else {
      // --- Logic for 'Manual' mode ---
      if (selectedQuestions.length === 0) {
        setError('Please select at least one question.');
        return;
      }
      requestBody = {
        selectionMode: "MANUAL",
        questionNumbers: selectedQuestions
      };
    }

    // --- FIX: This try/catch block is now OUTSIDE the if/else ---
    try {
      console.log("Starting game with settings:", requestBody);
      // This post simply *triggers* the start
      const resp = await axios.post(
        `${ROOM_API_BASE_URL}/room/start?roomCode=${roomData.roomCode}`,
        requestBody 
      );
      console.log("Response from start request:", resp);
      // The WebSocket listener will handle the navigation to /game
    } catch (err) {
      setError('Failed to start the game.');
      console.error(err);
    }
  };

  // Guard clause (No Changes)
  if (!roomData) {
    return <Navigate to="/" replace />;
  }

  const isHost = currentUser === roomData.host;
  const isWaiting = roomData.status === 'waiting';

  // --- Return JSX (No Changes) ---
  return (
    <div style={lobbyStyles.container}>
      <h2 style={lobbyStyles.header}>Lobby</h2>

      <div style={lobbyStyles.mainContent}>
        <div style={lobbyStyles.leftSection}>
          <div style={lobbyStyles.lobbyInfo}>
            <p>Room Code: <strong style={lobbyStyles.roomCode}>{roomData.roomCode}</strong></p>
            <p>Host: {roomData.host}</p>
            <p>Status: {roomData.status}</p>
          </div>
          <br /><br />
          <h3>Players ({roomData.players.length}):</h3>
          <ul style={lobbyStyles.list}>
            {roomData.players.map(player => (
              <li key={player} style={lobbyStyles.listItem}>
                {player} {player === currentUser ? '(You)' : ''} {player === roomData.host ? '👑' : ''}
              </li>
            ))}
          </ul>
        </div>

        <div style={lobbyStyles.rightSection}>
          {isHost && isWaiting && (
            <form onSubmit={handleStartGame} style={lobbyStyles.form}>
              <h3 style={lobbyStyles.subHeader}>Contest Settings</h3>

              {/* --- Mode Toggle Buttons --- */}
              <div style={lobbyStyles.modeToggle}>
                <button
                  type="button"
                  onClick={() => setSelectionMode('random')}
                  style={selectionMode === 'random' ? lobbyStyles.modeButtonActive : lobbyStyles.modeButton}
                >
                  Random Selection
                </button>
                <button
                  type="button"
                  onClick={() => setSelectionMode('manual')}
                  style={selectionMode === 'manual' ? lobbyStyles.modeButtonActive : lobbyStyles.modeButton}
                >
                  Manual Selection
                </button>
              </div>

              {/* --- 'Random' Mode UI --- */}
              {selectionMode === 'random' && (
                <div style={lobbyStyles.modeContent}>
                  <label>
                    Number of Easy Questions:
                    <input
                      type="number"
                      value={numEasy}
                      onChange={(e) => setNumEasy(parseInt(e.target.value) || 0)}
                      style={lobbyStyles.input}
                      min="0"
                    />
                  </label>
                  {/* ... other random inputs ... */}
                   <label>
                    Number of Medium Questions:
                    <input
                      type="number"
                      value={numMedium}
                      onChange={(e) => setNumMedium(parseInt(e.target.value) || 0)}
                      style={lobbyStyles.input}
                      min="0"
                    />
                  </label>
                  <label>
                    Number of Hard Questions:
                    <input
                      type="number"
                      value={numHard}
                      onChange={(e) => setNumHard(parseInt(e.target.value) || 0)}
                      style={lobbyStyles.input}
                      min="0"
                    />
                  </label>
                </div>
              )}

              {/* --- 'Manual' Mode UI --- */}
              {selectionMode === 'manual' && (
                <div style={lobbyStyles.modeContent}>
                  {isLoadingQuestions && <p>Loading questions...</p>}
                  {fetchError && <p style={lobbyStyles.error}>{fetchError}</p>}
                  <ul style={lobbyStyles.questionList}>
                    {allQuestions.map(q => (
                      <li key={q.questionNumber} style={lobbyStyles.questionItem}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(q.questionNumber)}
                            onChange={() => handleQuestionToggle(q.questionNumber)}
                          />
                          {q.title} ({q.difficulty})
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" style={lobbyStyles.button}>Start Game</button>
            </form>
          )}

          {!isHost && isWaiting && (
            <p style={lobbyStyles.waitingText}>
              Waiting for the host ({roomData.host}) to start the game...
            </p>
          )}
        </div>
      </div>

      {error && <p style={lobbyStyles.error}>{error}</p>}
    </div>
  );
}

export default LobbyPage;