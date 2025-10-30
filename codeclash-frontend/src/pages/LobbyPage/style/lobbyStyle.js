const lobbyStyles = {
  container: {
    backgroundColor: "#0d1117",
    color: "#e6edf3",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#58a6ff",
    marginBottom: "20px",
  },
  mainContent: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },
  leftSection: {
    flex: "1",
    minWidth: "280px",
    backgroundColor: "#161b22",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(88,166,255,0.3)",
  },
  rightSection: {
    flex: "1",
    minWidth: "280px",
    backgroundColor: "#161b22",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(88,166,255,0.3)",
  },
  lobbyInfo: {
    marginBottom: "15px",
    fontSize: "1rem",
  },
  roomCode: {
    color: "#f0f6fc",
    background: "#21262d",
    padding: "5px 10px",
    borderRadius: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#21262d",
    marginBottom: "8px",
    padding: "10px",
    borderRadius: "8px",
    transition: "background 0.3s",
     width: "90%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  subHeader: {
    color: "#58a6ff",
    marginBottom: "10px",
  },
  input: {
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    color: "#e6edf3",
    borderRadius: "6px",
    padding: "8px",
    marginTop: "5px",
    width: "10%",
  },
  button: {
    backgroundColor: "#238636",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    transition: "0.3s",
  },
  error: {
    color: "#f85149",
    textAlign: "center",
    marginTop: "15px",
  },
  waitingText: {
    textAlign: "center",
    color: "#8b949e",
  },
  // Mobile responsive
  '@media (max-width: 768px)': {
    mainContent: {
      flexDirection: "column",
    },
  },
};

export default lobbyStyles;
