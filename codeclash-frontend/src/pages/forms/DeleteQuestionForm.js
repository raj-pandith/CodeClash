import React, { useState } from 'react';
import { QUESTION_API_BASE_URL } from '../../api/apis';
import deleteSytle from './style/DeleteFormStyles.js';
import { useNavigate } from 'react-router-dom';

function DeleteQuestionForm() {
  const [questionNumber, setQuestionNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate=useNavigate();

  const handleChange = (e) => {
    setQuestionNumber(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!questionNumber) {
      setError('Please enter a Question Number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${QUESTION_API_BASE_URL}/questions/${questionNumber}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
       const  errData = await response.json();
        throw new Error(errData.message || `Error: ${response.status}`);
      }

      setSuccess(`Question with number ${questionNumber} deleted successfully.`);
      setQuestionNumber('');

    } catch (err) {
      setError("already deleted !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={deleteSytle.container}>
      <h2 style={deleteSytle.title}>Delete Question</h2>
      <button
        onClick={() => navigate('/add-question')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          borderRadius: '5px',
          backgroundColor: '#0a6b92ff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          scale:"0.7"
        }}
      >Add Question</button>
      <form onSubmit={handleDelete} style={deleteSytle.form}>
        <div style={deleteSytle.formGroup}>
          <label htmlFor="questionNumber">Question Number</label>
          <input
            type="number"
            id="questionNumber"
            value={questionNumber}
            onChange={handleChange}
            style={deleteSytle.input}
            required
          />
        </div>

        <div style={deleteSytle.feedback}>
          {loading && <p>Deleting...</p>}
          {error && <p style={deleteSytle.errorText}>{error}</p>}
          {success && <p style={deleteSytle.successText}>{success}</p>}
        </div>

        <button type="submit" disabled={loading} style={deleteSytle.deleteButton}>
          {loading ? 'Deleting...' : 'Delete Question'}
        </button>
      </form>
    </div>
  );
}

export default DeleteQuestionForm;
