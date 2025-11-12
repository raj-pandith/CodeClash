// ./style/lobbyStyle.js

const lobbyStyles = {
  container: {
    padding: '20px',
    maxWidth: '80%',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a1a', // Dark background
    color: '#f5f5f5',         // Light text
    minHeight: '80vh',
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

  // --- NEW: Difficulty Color Styles ---
  difficultyEasy: {
    color: '#81C784', // Light Green
    fontWeight: 'bold',
  },
  difficultyMedium: {
    color: '#FFB74D', // Light Orange
    fontWeight: 'bold',
  },
  difficultyHard: {
    color: '#e57373', // Light Red
    fontWeight: 'bold',
  },
};

export default lobbyStyles;