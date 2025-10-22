import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // <-- 1. Import useParams

// (Your styles object can stay the same)
const styles = { /* ... */ };

// --- 2. Remove roomCode from props ---
function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 3. Get roomCode from the URL ---
  const { roomCode } = useParams();

  const fetchLeaderboard = async () => {
    if (!roomCode) return; // Don't fetch if there's no room code
    setIsLoading(true);
    setError(null);
    setLeaderboard([]);

    try {
      // The URL now uses the roomCode from the params
      const url = `http://localhost:8082/submissions/leaderboard/${roomCode}`;
      const response = await axios.get(url);

      console.log(response);

      const sortedData = response.data.sort((a, b) => {
        if (a.solvedQuestionsCount !== b.solvedQuestionsCount) {
          return b.solvedQuestionsCount - a.solvedQuestionsCount;
        }
        return a.earliestPass - b.earliestPass;
      });

      setLeaderboard(sortedData);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Could not load leaderboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. (Optional) Fetch data on page load ---
  // This makes it load automatically when you navigate to the page.
  useEffect(() => {
    fetchLeaderboard();
  }, [roomCode]); // Re-run if the roomCode changes

  return (
    <div style={styles.container}>
      <h2>Leaderboard for Room: {roomCode}</h2>
      
      {/* You can keep the button to allow manual refresh */}
      <button
        onClick={fetchLeaderboard}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? 'Loading...' : 'Refresh Leaderboard'}
      </button>

      {/* (Rest of your component is the same) */}
      {isLoading && <p style={styles.loading}>Fetching results...</p>}
      {/* ... etc ... */}

      {
            leaderboard.map(ele=>(
                <div>{ele.playerId} , {ele.solvedQuestionsCount} </div>
            ))
      }
    </div>
  );
}

export default Leaderboard;