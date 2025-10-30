import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOM_API_BASE_URL } from "../../api/apis";
import axios from "axios";

function HomePage({ setRoomData, setCurrentUser }) {
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // 📱 Detect screen resize to handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // 🌌 Shared dark neon style presets
  const inputBase = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#111",
    color: "#fff",
    outline: "none",
    transition: "0.3s",
  };

  const buttonBase = {
    width: "100%",
    padding: "12px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: isMobile ? "5%" : "0 10%",
        backgroundColor: "#0d0d0d",
        color: "#f5f5f5",
        fontFamily: "Poppins, sans-serif",
        gap: isMobile ? "30px" : "0",
      }}
    >
      {/* Create Room Section */}
      <div
        style={{
          flex: "1",
          textAlign: "center",
          border: "2px solid #00ffff",
          padding: "40px",
          borderRadius: "15px",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 0 15px #00ffff88",
          marginRight: isMobile ? "0" : "30px",
          width: isMobile ? "100%" : "45%",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#00ffff" }}>Create a Room</h2>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Enter your name (Host)"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            style={{ ...inputBase, border: "1px solid #00ffff" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #00ffff")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            type="submit"
            style={{ ...buttonBase, backgroundColor: "#00ffff", color: "#000" }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#00cccc")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00ffff")}
          >
            Create Room
          </button>
        </form>
      </div>

      {/* Join Room Section */}
      <div
        style={{
          flex: "1",
          textAlign: "center",
          border: "2px solid #ff007f",
          padding: "40px",
          borderRadius: "15px",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 0 15px #ff007f88",
          marginLeft: isMobile ? "0" : "30px",
          width: isMobile ? "100%" : "45%",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#ff007f" }}>Join a Room</h2>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            style={{ ...inputBase, border: "1px solid #ff007f" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #ff007f")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ ...inputBase, border: "1px solid #ff007f" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #ff007f")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            type="submit"
            style={{ ...buttonBase, backgroundColor: "#ff007f", color: "#fff" }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#cc0066")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff007f")}
          >
            Join Room
          </button>
        </form>
      </div>

      {error && (
        <p
          style={{
            position: "absolute",
            bottom: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ff3333",
            fontWeight: "bold",
            textShadow: "0 0 10px red",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default HomePage;
