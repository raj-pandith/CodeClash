// const lobbyStyles = {
//   container: {
//     backgroundColor: "#0d1117",
//     color: "#e6edf3",
//     minHeight: "100vh",
//     padding: "20px",
//     fontFamily: "'Poppins', sans-serif",
//   },
//   header: {
//     textAlign: "center",
//     fontSize: "2rem",
//     color: "#58a6ff",
//     marginBottom: "20px",
//   },
//   mainContent: {
//     display: "flex",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     gap: "20px",
//   },
//   leftSection: {
//     flex: "1",
//     minWidth: "280px",
//     backgroundColor: "#161b22",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(88,166,255,0.3)",
//   },
//   rightSection: {
//     flex: "1",
//     minWidth: "280px",
//     backgroundColor: "#161b22",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(88,166,255,0.3)",
//   },
//   lobbyInfo: {
//     marginBottom: "15px",
//     fontSize: "1rem",
//   },
//   roomCode: {
//     color: "#f0f6fc",
//     background: "#21262d",
//     padding: "5px 10px",
//     borderRadius: "8px",
//   },
//   list: {
//     listStyle: "none",
//     padding: 0,
//   },
//   listItem: {
//     backgroundColor: "#21262d",
//     marginBottom: "8px",
//     padding: "10px",
//     borderRadius: "8px",
//     transition: "background 0.3s",
//      width: "90%",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   subHeader: {
//     color: "#58a6ff",
//     marginBottom: "10px",
//   },
//   input: {
//     backgroundColor: "#0d1117",
//     border: "1px solid #30363d",
//     color: "#e6edf3",
//     borderRadius: "6px",
//     padding: "8px",
//     marginTop: "5px",
//     width: "10%",
//   },
//   button: {
//     backgroundColor: "#238636",
//     color: "#fff",
//     border: "none",
//     padding: "10px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     marginTop: "10px",
//     fontWeight: "bold",
//     transition: "0.3s",
//   },
//   error: {
//     color: "#f85149",
//     textAlign: "center",
//     marginTop: "15px",
//   },
//   waitingText: {
//     textAlign: "center",
//     color: "#8b949e",
//   },
//   // Mobile responsive
//   '@media (max-width: 768px)': {
//     mainContent: {
//       flexDirection: "column",
//     },
//   },
// };

// export default lobbyStyles;

// ./style/lobbyStyle.js

const lobbyStyles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a1a', // Dark background
    color: '#f5f5f5',         // Light text
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    color: '#f5f5f5',
    borderBottom: '2px solid #444', // Lighter border
    paddingBottom: '10px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  leftSection: {
    flex: 1,
    paddingRight: '20px',
  },
  rightSection: {
    flex: 1,
    paddingLeft: '20px',
    borderLeft: '1px solid #444', // Lighter border
  },
  lobbyInfo: {
    background: '#2c2c2c', // Dark card background
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #444',
  },
  roomCode: {
    color: '#00ffff', // Bright cyan for emphasis
    fontWeight: 'bold',
    fontSize: '1.2em',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    background: '#2c2c2c', // Dark card background
    border: '1px solid #444',
    marginBottom: '5px',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  subHeader: {
    color: '#f5f5f5',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
    backgroundColor: '#222', // Even darker for input
    color: '#f5f5f5',
    border: '1px solid #555',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#5cb85c', // Keep green for "start"
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  waitingText: {
    fontSize: '1.1em',
    color: '#aaa', // Lighter gray for secondary text
  },
  error: {
    color: '#ff5252', // Brighter red for errors
    marginTop: '10px',
  },

  // --- STYLES FOR THE MODE TOGGLE ---
  modeToggle: {
    display: 'flex',
    marginBottom: '20px',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    padding: '10px',
    border: '1px solid #555',
    background: '#2c2c2c', // Dark inactive button
    color: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '15px',
  },
  modeButtonActive: {
    flex: 1,
    padding: '10px',
    border: '1px solid #007bff', // Keep blue for "active"
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
  },
  modeContent: {
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '5px',
    marginBottom: '15px',
    backgroundColor: '#2c2c2c', // Dark card background
  },
  questionList: {
    listStyleType: 'none',
    padding: 0,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  questionItem: {
    padding: '8px',
    borderBottom: '1px solid #444',
  },
};

export default lobbyStyles;