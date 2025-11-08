import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../leaderboardPage/style/leaderboardStyle';
import { SUBMISSION_API_BASE_URL } from "../../api/apis";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    if (!roomCode) return;
    setIsLoading(true);
    setError(null);
    setLeaderboard([]);

    try {
      const url = `${SUBMISSION_API_BASE_URL}/submissions/leaderboard/${roomCode}`;
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

  // Convert milliseconds → mm:ss
 const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp; // difference in ms

  if (diff < 0) return "—"; // future timestamp safety

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s ago`;
};


  useEffect(() => {
    fetchLeaderboard();
  }, [roomCode]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Leaderboard for Room: {roomCode}</h2>

      <div style={styles.buttonContainer}>
        <button
          onClick={fetchLeaderboard}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Refreshing...' : '🔄 Refresh Leaderboard'}
        </button>

        
        <button
          onClick={() => navigate('/game')}
          style={styles.secondaryButton}
        >
          💻 Go to Code Editor
        </button>

        <button
          onClick={() => navigate('/')}
          style={styles.secondaryButton}
        >
          🏠 Create New Room
        </button>
      
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tableContainer}>
        {isLoading ? (
          <p style={styles.loading}>Fetching leaderboard...</p>
        ) : leaderboard.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Player</th>
                <th style={styles.th}>Solved</th>
                <th style={styles.th}>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={player.playerId}
                  style={{
                    ...styles.tr,
                    background:
                      index === 0
                        ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                        : index === 1
                        ? 'linear-gradient(90deg, #C0C0C0, #A9A9A9)'
                        : index === 2
                        ? 'linear-gradient(90deg, #CD7F32, #8B4513)'
                        : styles.row.background,
                  }}
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{player.playerId}</td>
                  <td style={styles.td}>{player.solvedQuestionsCount}</td>
                  <td style={styles.td}>{formatTime(player.earliestPass)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noData}>No data available yet.</p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
