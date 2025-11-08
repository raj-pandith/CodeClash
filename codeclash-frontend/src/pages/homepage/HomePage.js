import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOM_API_BASE_URL } from "../../api/apis";
import axios from "axios";
import { getStyles } from "./style/homePageStyles"; 

function HomePage({ setRoomData, setCurrentUser }) {
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // detect mobile resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = getStyles(isMobile);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!hostName) return;
    try {
      const response = await axios.post(
        `${ROOM_API_BASE_URL}/room/create?hostName=${hostName}`
      );
      setRoomData(response.data);
      setCurrentUser(hostName);
      navigate("/lobby");
    } catch (err) {
      setError("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!playerName || !roomCode) return;
    try {
      const response = await axios.post(
        `${ROOM_API_BASE_URL}/room/join?roomCode=${roomCode}&playerName=${playerName}`
      );
      setRoomData(response.data);
      setCurrentUser(playerName);
      navigate("/lobby");
    } catch (err) {
      setError("Failed to join room. Check the code or name.");
    }
  };

  return (

    <div style={styles.container}>
      {/* Create Room */}
      <div style={{ ...styles.boxBase, ...styles.createBox }}>
        <h2 style={{ color: "#00ffff", marginBottom: "25px" }}>Create a Room</h2>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Enter your name (Host)"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            style={{ ...styles.inputBase, ...styles.createInput }}
          />
          <button
            type="submit"
            style={styles.createButton}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#00cccc")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00ffff")}
            >
            Create Room
          </button>
        </form>
      </div>

      {/* Join Room */}
      <div style={{ ...styles.boxBase, ...styles.joinBox }}>
        <h2 style={{ color: "#ff007f", marginBottom: "25px" }}>Join a Room</h2>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={{ ...styles.inputBase, ...styles.joinInput }}
            />
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ ...styles.inputBase, ...styles.joinInput }}
            />
          <button
            type="submit"
            style={styles.joinButton}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#cc0066")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff007f")}
            >
            Join Room
          </button>
        </form>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

export default HomePage;
