import React, { useState } from 'react';
import styles from './style/styles.js';

const initialState = {
  questionNumber: '',
  title: '',
  description: '',
  difficulty: 'Easy',
  inputFormate: '',
  testCases: []
};

export default function AddQuestionForm() {
  const [question, setQuestion] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const newTestCases = question.testCases.map((tc, i) =>
      i === index ? { ...tc, [name]: value } : tc
    );
    setQuestion(prev => ({ ...prev, testCases: newTestCases }));
  };

  const addTestCase = () => {
    setQuestion(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
  };

  const removeTestCase = (indexToRemove) => {
    setQuestion(prev => ({
      ...prev,
      testCases: question.testCases.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = { ...question, questionNumber: parseInt(question.questionNumber, 10) };

    try {
      const response = await fetch('http://localhost:8081/questions/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Error: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(`Success! Question "${result.title}" added with Question Number: ${result.questionNumber}`);
      setQuestion(initialState);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"2%"}}>
        <h2 style={styles.title}>Add New Question</h2>
        {/* <h2 style={styles.title}>Add New Question</h2> */}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>

        {/* --- Two-column layout --- */}
        <div style={styles.columns}>

          {/* --- Left Column: Question Details --- */}
          <div style={styles.leftColumn}>
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
                rows="4"
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
                rows="3"
                required
              />
            </div>
          </div>

          {/* --- Right Column: Test Cases --- */}
          <div style={styles.rightColumn}>
            <h3 style={styles.subTitle}>Test Cases</h3>
            {question.testCases.map((tc, index) => (
              <div key={index} style={styles.testCaseBox}>
                <h4>Test Case {index + 1}</h4>
                <div style={styles.formGroup}>
                  <label htmlFor={`input-${index}`}>Input</label>
                  <textarea
                    id={`input-${index}`}
                    name="input"
                    value={tc.input}
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
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, e)}
                    style={styles.textarea}
                    rows="2"
                    required
                  />
                </div>
                <button type="button" onClick={() => removeTestCase(index)} style={styles.removeButton}>
                  Remove Test Case
                </button>
              </div>
            ))}

            <button type="button" onClick={addTestCase} style={styles.addButton}>
              + Add Test Case
            </button>
          </div>
        </div>

        {/* --- Submission & Feedback --- */}
        <div style={styles.feedback}>
          {loading && <p>Submitting...</p>}
          {error && <p style={styles.errorText}>{error}</p>}
          {success && <p style={styles.successText}>{success}</p>}
        </div>

        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? 'Saving...' : 'Save Question'}
        </button>
      </form>
    </div>
  );
}


