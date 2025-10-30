const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 10px',
    fontFamily: "'Poppins', sans-serif",
  },

  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '25px',
    textShadow: '0 0 10px #00FFFF',
  },

  buttonContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '25px',
  },

  button: {
    backgroundColor: '#00FFFF',
    color: '#000',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 0 10px #00FFFF',
    transition: '0.3s ease',
  },

  secondaryButton: {
    backgroundColor: '#222',
    color: '#fff',
    padding: '10px 18px',
    border: '1px solid #00FFFF',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s ease',
  },

  tableContainer: {
    width: '95%',
    maxWidth: '900px',
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#111',
  },

  th: {
    background: '#00FFFF33',
    color: '#00FFFF',
    textAlign: 'center',
    padding: '12px',
    fontSize: '1rem',
    textTransform: 'uppercase',
  },

  tr: {
    transition: '0.3s',
  },

  td: {
    textAlign: 'center',
    padding: '10px',
    borderBottom: '1px solid #333',
    color: '#fff',
  },

  noData: {
    color: '#aaa',
    display:"flex",
    justifyContent:"center"
  },

  loading: {
    color: '#00FFFF',
  },

  error: {
    color: '#FF5555',
  },

  row: {
    background: '#1a1a1a',
  },
};

export default styles;
