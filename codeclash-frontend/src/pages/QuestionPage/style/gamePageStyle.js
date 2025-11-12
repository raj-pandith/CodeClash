const gamePageStyle = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#121212',
    color: '#e0e0e0',
    minHeight: '100vh',
    padding: '20px',
    gap: '20px',
  },
  questionSection: {
    flex: 1,
    minWidth: '300px',
    maxWidth:'35%',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
  },
  tabContainer: {
    marginBottom: '15px',
  },
  tabButton: {
    border: 'none',
    padding: '8px 15px',
    marginRight: '10px',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
  timerBox: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '5px',
    margin: '5px auto',
    backgroundColor: '#2c2c2c',
    borderRadius: '8px',
    border: '1px solid #444',
    width: '100px',
  },
  questionBox: {
    backgroundColor: '#2c2c2c',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '10px',
  },
  difficulty: {
    fontWeight: 'bold',
    fontSize: '0.9em',
    color: '#f5f5f5', // Default text color
    padding: '4px 10px',
    borderRadius: '15px', // Pill shape
    display: 'inline-block', // Makes the background fit the text
    marginTop: '5px',
    marginBottom: '15px',
    backgroundColor: '#555', // Default background
  },
  difficultyEasy: {
    backgroundColor: '#1b5e20', // Dark Green
    color: '#81C784', // Light Green text
  },
  difficultyMedium: {
    backgroundColor: '#663c00', // Dark Orange
    color: '#FFB74D', // Light Orange text
  },
  difficultyHard: {
    backgroundColor: '#b71c1c', // Dark Red
    color: '#e57373', // Light Red text
  },
  exitButton: {
    backgroundColor: '#d9534f', // Red "danger" color
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    alignSelf:'end',
    scale:0.7
  },
  testCaseBox: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '8px',
    border: '1px solid #444',
  },
  editorSection: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  },
  editorHeader: {
    marginBottom: '10px',
  },
  label: {
    marginRight: '10px',
  },
  select: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    border: '1px solid #555',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  submitButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#00bcd4',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  resultBox: {
    marginTop: '15px',
  },
  resultList: {
    listStyle: 'none',
    padding: 0,
  },
  resultItem: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    color: '#fff',
  },
  leaderboardBtn: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#444',
    color: '#00bcd4',
    border: '1px solid #00bcd4',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default gamePageStyle;
