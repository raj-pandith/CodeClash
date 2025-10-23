
import React, { useState } from 'react';

// Define the initial empty state for the form
const initialState = {
  questionNumber: '',
  title: '',
  description: '',
  difficulty: 'Easy', // Default value
  inputFormate: '',
  testCases: []
};

function AddQuestionForm() {
  const [question, setQuestion] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- 1. Main Form State Handler ---
  // Handles changes for all simple input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- 2. Test Case State Handlers ---
  
  // Handles changes within a specific test case
  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    // Create a new array of test cases
    const newTestCases = question.testCases.map((testCase, i) => {
      if (i === index) {
        // Update the specific test case
        return { ...testCase, [name]: value };
      }
      return testCase;
    });
    
    setQuestion(prev => ({
      ...prev,
      testCases: newTestCases
    }));
  };

  // Adds a new, empty test case object to the state
  const addTestCase = () => {
    setQuestion(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
  };

  // Removes a test case by its index
  const removeTestCase = (indexToRemove) => {
    setQuestion(prev => ({
      ...prev,
      testCases: question.testCases.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- 3. Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Prepare the payload, ensuring questionNumber is an integer
    const payload = {
      ...question,
      questionNumber: parseInt(question.questionNumber, 10)
    };

    try {
      const response = await fetch('http://localhost:8081/questions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Handle HTTP errors (like 409 Conflict, 400 Bad Request)
        const errData = await response.json();
        throw new Error(errData.message || `Error: ${response.status}`);
      }

      // Success!
      const result = await response.json();
      setSuccess(`Success! Question "${result.title}" added with ID: ${result.id}`);
      setQuestion(initialState); // Reset the form
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Question</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* --- Question Details --- */}
        <div style={styles.formGroup}>
          <label htmlFor="questionNumber">Question Number</label>
          <input
            type="number"
            id="questionNumber"
            name="questionNumber"
            value={question.questionNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={question.title}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={question.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="3"
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={question.difficulty}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="inputFormate">Input Format</label>
          <textarea
            id="inputFormate"
            name="inputFormate"
            value={question.inputFormate}
            onChange={handleChange}
            style={styles.textarea}
            rows="2"
            required
          />
        </div>

        {/* --- Test Cases Section --- */}
        <h3 style={styles.subTitle}>Test Cases</h3>
        {question.testCases.map((testCase, index) => (
          <div key={index} style={styles.testCaseBox}>
            <h4>Test Case {index + 1}</h4>
            <div style={styles.formGroup}>
              <label htmlFor={`input-${index}`}>Input</label>
              <textarea
                id={`input-${index}`}
                name="input"
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, e)}
                style={styles.textarea}
                rows="2"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor={`expectedOutput-${index}`}>Expected Output</label>
              <textarea
                id={`expectedOutput-${index}`}
                name="expectedOutput"
                value={testCase.expectedOutput}
                onChange={(e) => handleTestCaseChange(index, e)}
                style={styles.textarea}
                rows="2"
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeTestCase(index)}
              style={styles.removeButton}
            >
              Remove Test Case {index + 1}
            </button>
          </div>
        ))}
        
        <button type="button" onClick={addTestCase} style={styles.addButton}>
          + Add Test Case
        </button>

        {/* --- Submission & Feedback --- */}
        <div style={styles.feedback}>
          {loading && <p>Submitting...</p>}
          {error && <p style={styles.errorText}>{error}</p>}
          {success && <p style={styles.successText}>{success}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          style={styles.submitButton}
        >
          {loading ? 'Saving...' : 'Save Question'}
        </button>
        
      </form>
    </div>
  );
}

// --- Styles ---
// Using inline styles to keep the component self-contained
const styles = {
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '1.5rem'
  },
  subTitle: {
    color: '#444',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
    marginTop: '1.5rem'
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
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif'
  },
  testCaseBox: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '1rem',
    marginTop: '1rem',
    backgroundColor: '#f9f9f9'
  },
  addButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    color: '#007bff',
    backgroundColor: 'transparent',
    border: '2px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  removeButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    color: '#dc3545',
    backgroundColor: 'transparent',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  submitButton: {
    padding: '1rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#28a745',
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
    color: '#dc3545'
  },
  successText: {
    color: '#28a745'
  }
};

export default AddQuestionForm;