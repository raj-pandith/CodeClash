import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Editor } from '@monaco-editor/react';
import Leaderboard from './components/Leaderboard.js';
import AddQuestionForm from './pages/AddQuestionForm.js'

// --- STYLES (Same as before) ---
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  header: {
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '8px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  lobbyInfo: {
    marginBottom: '20px',
  },
  roomCode: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#555',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
  }
};

// --- API Base URL ---
const API_BASE_URL = 'http://localhost:8080';


// --- 1. Home Page Component (Create or Join) ---
// --- (No changes to this component) ---
function HomePage({ setRoomData, setCurrentUser }) {
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!hostName) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/room/create?hostName=${hostName}`);
      setRoomData(response.data);
      setCurrentUser(hostName); // Set the current user as the host
      navigate('/lobby');
      console.log("room create V")
      console.log(response.data)
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!playerName || !roomCode) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/room/join?roomCode=${roomCode}&playerName=${playerName}`);
      setRoomData(response.data);
      setCurrentUser(playerName); // Set the current user as the player
      navigate('/lobby');
    } catch (err) {
      setError('Failed to join room. Check the code or name.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create a Room</h2>
      <form onSubmit={handleCreateRoom} style={styles.form}>
        <input
          type="text"
          placeholder="Enter your name (Host)"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create Room</button>
      </form>

      <h2 style={styles.header}>Join a Room</h2>
      <form onSubmit={handleJoinRoom} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Join Room</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// --- 2. Lobby Page Component (Waiting Room) ---
// --- (This component is MODIFIED to use new difficulty settings) ---
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
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      
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
        `${API_BASE_URL}/room/start?roomCode=${roomData.roomCode}`,
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
// --- 3. Game Page Component (Actual Game) ---
// --- (No changes to this component) ---


// --- API Base URLs ---
const ROOM_API_BASE_URL = 'http://localhost:8080';
const QUESTION_API_BASE_URL = 'http://localhost:8081'; // <-- ADD THIS
const SUBMISSION_API_BASE_URL = 'http://localhost:8082'; // <-- ADD THIS


// --- 3. Game Page Component (Actual Game) ---
// --- (This component is MODIFIED to add a code editor and submit button) ---


// --- 3. Game Page Component (Actual Game) ---
// --- (This component is MODIFIED to poll for results) ---

// (Keep your import for Editor)
// --- 3. Game Page Component (Actual Game) ---
// --- (This component is MODIFIED to poll for results) ---

// (Keep your import for Editor)

function GamePageQuestion({ roomData, currentUser }) {
  // (Existing states from previous steps)
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [code, setCode] = useState(
`import java.util.*;
public class Main{
    public static void main(String[] arg){
        
    }
}`);
  const [language, setLanguage] = useState('java');

  // --- MODIFIED SUBMISSION STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false); // True during POST and polling
  const [submissionResult, setSubmissionResult] = useState(null); // Holds the FINAL JSON object
  const [submissionStatusText, setSubmissionStatusText] = useState(null); // Holds the status string

  // (This useEffect for fetching questions is unchanged)
  useEffect(() => {
    if (!roomData || !roomData.contestSettings) {
      navigate('/lobby');
      return;
    }
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log("request for all types random question")
        // Correct way for a POST request
  const response = await axios.post(
    `${QUESTION_API_BASE_URL}/questions/question-all-types-random`, 
    { // <-- This is the request body
      easy: roomData.contestSettings.easy,
      medium: roomData.contestSettings.medium,
      hard: roomData.contestSettings.hard,
    }
  );
    
      console.log("response for requested questions V")
        console.log(response.data);

        setQuestions(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Could not load questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [roomData, navigate]);

  // --- Polling function to get results ---
  // This function is ALREADY CORRECT based on your new info.
  // It checks for data.status === 'FINISHED'
  // and then displays data.passedTests / data.totalTests
  const pollForResult = async (submissionId) => {
    try {
      const res = await axios.get(`${SUBMISSION_API_BASE_URL}/submissions/${submissionId}`);
      const data = res.data;
      console.log("status of your submission")
      console.log(data);

      // Check the status from the GET response
      if (data.status === 'FINISHED' || data.status === 'ERROR' || data.status === 'FAILED') {
        // Base Case: Stop polling
        setIsSubmitting(false);
        setSubmissionResult(data); // Store the final result object
        
        // This is what you asked for!
        const statusMsg = `Finished: ${data.passedTests} / ${data.totalTests} passed.`;
        setSubmissionStatusText(statusMsg);

      } else {
        // Recursive Case: Poll again
        // This displays the "state of code" (e.g., "QUEUED", "RUNNING")
        setSubmissionStatusText(`Status: ${data.status}...`);
        
        // Wait 2 seconds and try again
        setTimeout(() => pollForResult(submissionId), 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
      setSubmissionStatusText('Error fetching results. Please try again.');
      console.error('Polling error:', err);
    }
  };

  // --- MODIFIED: Handle Code Submission ---
  const handleSubmitCode = async () => {
    if (isSubmitting || !questions[selectedQuestionIndex]) return;

    setIsSubmitting(true);
    setSubmissionResult(null); // Clear old results
    setSubmissionStatusText('Submitting code...'); // Set initial status

    
    const selectedQuestion = questions[selectedQuestionIndex];
    console.log(selectedQuestion)
    const payload = {
      playerId: currentUser,
      roomCode: roomData.roomCode,
      questionNumber: selectedQuestion.questionNumber,
      language: language,
      code: btoa(code), // Base64 encoding
    };

    try {
      // 1. POST the submission
      // console.log("request for submitting V")
      // console.log(payload);
      console.log(payload)
      const response = await axios.post(`${SUBMISSION_API_BASE_URL}/submissions`, payload);
      
      // 2. Get the ID and status from the POST response
      
      // --- THIS IS THE MODIFIED LINE ---
      const submissionId = response.data.submissionId; // Changed from response.data.id
      // -----------------------------------

      const initialStatus = response.data.status; // e.g., "queued"
      
      if (submissionId) {
        // Show the initial status from the POST response
        setSubmissionStatusText(`Status: ${initialStatus}...`);
        
        // Start the polling loop to check the GET endpoint
        pollForResult(submissionId); 
      } else {
        setSubmissionStatusText('Submitted, but could not get ID to poll for results.');
        setIsSubmitting(false);
      }

    } catch (err) {
      console.error('Submission failed:', err);
      setSubmissionStatusText('Submission failed. Please try again.');
      setIsSubmitting(false); // Stop on initial submission error
    }
  };

  // --- (Guards are the same as before) ---
  if (!roomData) return <Navigate to="/" replace />;
  if (roomData.status !== 'running') return <Navigate to="/lobby" replace />;
  if (loading) return <div style={styles.container}><h2>Loading Questions...</h2></div>;
  if (error) return <div style={styles.container}><h2 style={styles.error}>{error}</h2></div>;

  const selectedQuestion = questions[selectedQuestionIndex];

  return (
    <div style={styles.container}>
      {/* ... (Existing JSX for header and question tabs) ... */}
      {selectedQuestion ? (
        <div>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {questions.map((q, index) => (
              <button
                key={q.questionNumber}
                onClick={() => setSelectedQuestionIndex(index)}
                style={{
                  ...styles.button,
                  marginRight: '10px',
                  backgroundColor: index === selectedQuestionIndex ? '#0056b3' : '#007bff',
                }}
              >
                {index+1}
              </button>
            ))}
          </div>
          <h3>Q No:{selectedQuestion.questionNumber}</h3>
          <h3 style={styles.header}>{selectedQuestion.title} ({selectedQuestion.difficulty})</h3>
           <h5>Description :</h5>
          <h5>{selectedQuestion.description}</h5>
          
           <h5>Input Formate :</h5>
          <h5>{selectedQuestion.inputFormate}</h5>
          <h4>Test Cases:</h4>
          <ul style={styles.list}>
            {selectedQuestion.testCases.map((tc, index) => (
              <li key={index} style={styles.listItem}>
                <strong>Input:</strong> {tc.input} <br />
                <strong>Expected Output:</strong> {tc.expectedOutput}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No questions loaded.</p>
      )}

      {/* --- MODIFIED: CODE EDITOR AND SUBMIT SECTION --- */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={styles.header}>Code Editor</h3>
        
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{...styles.input, marginBottom: '10px', marginLeft: '10px'}}
          >
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </label>

        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
          <Editor
            height="40vh"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          style={{ ...styles.button, marginTop: '15px' }}
        >
          {isSubmitting ? 'Running...' : 'Submit Code'}
        </button>
        
        {/* --- Submission Status Display --- */}
        {/* This will show "Status: queued...", "Status: RUNNING...", 
            and finally "Finished: 0 / 3 passed." */}
        {submissionStatusText && (
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: submissionResult && submissionResult.passedTests === submissionResult.totalTests ? 'green' : 
                   submissionResult ? 'red' : '#555'
          }}>
            {submissionStatusText}
          </p>
        )}

        {/* --- Detailed Result Display (Already correct) --- */}
        {submissionResult && submissionResult.resultJson && (
            <div style={{marginTop: '15px'}}>
                <h4>Submission Details:</h4>
                <ul style={styles.list}>
                    {/* We must parse the resultJson string */}
                    {JSON.parse(submissionResult.resultJson).map((testCase) => (
                        <li key={testCase.testCaseId} style={{
                          ...styles.listItem, 
                          backgroundColor: testCase.passed ? '#e6ffed' : '#ffebee',
                          borderColor: testCase.passed ? '#b2fab4' : '#ffcdd2'
                        }}>
                            <strong>Test Case {testCase.testCaseId}:</strong> {testCase.passed ? 'Passed ✅' : 'Failed ❌'} <br />
                            <small>Expected: {testCase.expected}</small> <br />
                            <small>Got: {testCase.output}</small>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </div>

      {/* --- (Scoreboard is the same as before) --- */}
      {/* <h3 style={{ ...styles.header, marginTop: '30px' }}>Scoreboard:</h3>
      <ul style={styles.list}>
        {Object.entries(roomData.playerStats).map(([playerName, stats]) => (
          <li key={playerName} style={styles.listItem}>
            <strong>{playerName}:</strong> {stats.solved} solved (Time: {stats.timeTaken}ms)
          </li>
        ))}
      </ul>
       */}
       <button onClick={()=>navigate(`/leaderboard/`+roomData.roomCode)}>leaderboard</button>
    </div>
  );
}

// --- App Component (Router and State) ---
// --- (No changes to this component) ---
function App() {
  const [roomData, setRoomData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage setRoomData={setRoomData} setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/lobby"
          element={<LobbyPage roomData={roomData} setRoomData={setRoomData} currentUser={currentUser} />}
        />
        <Route
          path="/game"
          element={<GamePageQuestion roomData={roomData} currentUser={currentUser} />}
        />
        <Route path="/leaderboard/:roomCode" element={<Leaderboard />} />
        <Route path="/add-question" element={<AddQuestionForm/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;