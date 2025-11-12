// --- Dark Theme Styles ---
const styles = {
  container: {
    maxWidth: '90%',
    margin: '1rem auto',
    padding: '3rem',
    borderRadius: '8px',
    backgroundColor: '#1e1e2f',
    color: '#f1f1f1',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#fff',
  },
  columns: {
    display: 'flex',
    gap: '2rem'
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1
  },
  subTitle: {
    color: '#ffb74d',
    borderBottom: '1px solid #555',
    paddingBottom: '6px',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#2e2e3e',
    color: '#f1f1f1'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#2e2e3e',
    color: '#f1f1f1'
  },
  testCaseBox: {
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#2a2a3b'
  },
  addButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    color: '#4fc3f7',
    backgroundColor: 'transparent',
    border: '2px solid #4fc3f7',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  removeButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    color: '#f44336',
    backgroundColor: 'transparent',
    border: '1px solid #f44336',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  submitButton: {
    padding: '1rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  feedback: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  errorText: {
    color: '#f44336'
  },
  successText: {
    color: '#4caf50'
  }
};

export default styles;
