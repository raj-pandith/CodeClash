import styles from "../../style/style";
import { Editor } from '@monaco-editor/react';
import { QUESTION_API_BASE_URL ,SUBMISSION_API_BASE_URL} from "../../api/apis";
import axios from "axios";
import { Navigate ,useNavigate} from "react-router-dom";
import { useState ,useEffect} from "react";

function GamePageQuestion({ roomData, currentUser }) {
  // (Existing states from previous steps)
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [code, setCode] = useState(
`import java.util.*;
public class Main{
    public static void main(String[] arg){
        
    }
}`);
  const [language, setLanguage] = useState('java');

  // --- MODIFIED SUBMISSION STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false); // True during POST and polling
  const [submissionResult, setSubmissionResult] = useState(null); // Holds the FINAL JSON object
  const [submissionStatusText, setSubmissionStatusText] = useState(null); // Holds the status string

  // (This useEffect for fetching questions is unchanged)
  useEffect(() => {
    if (!roomData || !roomData.contestSettings) {
      navigate('/lobby');
      return;
    }
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log("request for all types random question")
        // Correct way for a POST request
  const response = await axios.post(
    `${QUESTION_API_BASE_URL}/questions/question-all-types-random`, 
    { // <-- This is the request body
      easy: roomData.contestSettings.easy,
      medium: roomData.contestSettings.medium,
      hard: roomData.contestSettings.hard,
    }
  );
    
      console.log("response for requested questions V")
        console.log(response.data);

        setQuestions(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Could not load questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [roomData, navigate]);

  // --- Polling function to get results ---
  // This function is ALREADY CORRECT based on your new info.
  // It checks for data.status === 'FINISHED'
  // and then displays data.passedTests / data.totalTests
  const pollForResult = async (submissionId) => {
    try {
      const res = await axios.get(`${SUBMISSION_API_BASE_URL}/submissions/${submissionId}`);
      const data = res.data;
      console.log("status of your submission")
      console.log(data);

      // Check the status from the GET response
      if (data.status === 'FINISHED' || data.status === 'ERROR' || data.status === 'FAILED') {
        // Base Case: Stop polling
        setIsSubmitting(false);
        setSubmissionResult(data); // Store the final result object
        
        // This is what you asked for!
        const statusMsg = `Finished: ${data.passedTests} / ${data.totalTests} passed.`;
        setSubmissionStatusText(statusMsg);

      } else {
        // Recursive Case: Poll again
        // This displays the "state of code" (e.g., "QUEUED", "RUNNING")
        setSubmissionStatusText(`Status: ${data.status}...`);
        
        // Wait 2 seconds and try again
        setTimeout(() => pollForResult(submissionId), 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
      setSubmissionStatusText('Error fetching results. Please try again.');
      console.error('Polling error:', err);
    }
  };

  // --- MODIFIED: Handle Code Submission ---
  const handleSubmitCode = async () => {
    if (isSubmitting || !questions[selectedQuestionIndex]) return;

    setIsSubmitting(true);
    setSubmissionResult(null); // Clear old results
    setSubmissionStatusText('Submitting code...'); // Set initial status

    
    const selectedQuestion = questions[selectedQuestionIndex];
    console.log(selectedQuestion)
    const payload = {
      playerId: currentUser,
      roomCode: roomData.roomCode,
      questionNumber: selectedQuestion.questionNumber,
      language: language,
      code: btoa(code), // Base64 encoding
    };

    try {
      // 1. POST the submission
      // console.log("request for submitting V")
      // console.log(payload);
      console.log(payload)
      const response = await axios.post(`${SUBMISSION_API_BASE_URL}/submissions`, payload);
      
      // 2. Get the ID and status from the POST response
      
      // --- THIS IS THE MODIFIED LINE ---
      const submissionId = response.data.submissionId; // Changed from response.data.id
      // -----------------------------------

      const initialStatus = response.data.status; // e.g., "queued"
      
      if (submissionId) {
        // Show the initial status from the POST response
        setSubmissionStatusText(`Status: ${initialStatus}...`);
        
        // Start the polling loop to check the GET endpoint
        pollForResult(submissionId); 
      } else {
        setSubmissionStatusText('Submitted, but could not get ID to poll for results.');
        setIsSubmitting(false);
      }

    } catch (err) {
      console.error('Submission failed:', err);
      setSubmissionStatusText('Submission failed. Please try again.');
      setIsSubmitting(false); // Stop on initial submission error
    }
  };

  // --- (Guards are the same as before) ---
  if (!roomData) return <Navigate to="/" replace />;
  if (roomData.status !== 'running') return <Navigate to="/lobby" replace />;
  if (loading) return <div style={styles.container}><h2>Loading Questions...</h2></div>;
  if (error) return <div style={styles.container}><h2 style={styles.error}>{error}</h2></div>;

  const selectedQuestion = questions[selectedQuestionIndex];

  return (
    <div style={styles.container}>
      {/* ... (Existing JSX for header and question tabs) ... */}
      {selectedQuestion ? (
        <div>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {questions.map((q, index) => (
              <button
                key={q.questionNumber}
                onClick={() => setSelectedQuestionIndex(index)}
                style={{
                  ...styles.button,
                  marginRight: '10px',
                  backgroundColor: index === selectedQuestionIndex ? '#0056b3' : '#007bff',
                }}
              >
                {index+1}
              </button>
            ))}
          </div>
          <h3>Q No:{selectedQuestion.questionNumber}</h3>
          <h3 style={styles.header}>{selectedQuestion.title} ({selectedQuestion.difficulty})</h3>
           <h5>Description :</h5>
          <h5>{selectedQuestion.description}</h5>
          
           <h5>Input Formate :</h5>
          <h5>{selectedQuestion.inputFormate}</h5>
          <h4>Test Cases:</h4>
          <ul style={styles.list}>
            
      {selectedQuestion.testCases.length > 0 && (
        <li style={styles.listItem}>
          <strong>Input:</strong> {selectedQuestion.testCases[0].input} <br />
          <strong>Expected Output:</strong> {selectedQuestion.testCases[0].expectedOutput}
        </li>
      )}

          </ul>
        </div>
      ) : (
        <p>No questions loaded.</p>
      )}

      {/* --- MODIFIED: CODE EDITOR AND SUBMIT SECTION --- */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={styles.header}>Code Editor</h3>
        
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{...styles.input, marginBottom: '10px', marginLeft: '10px'}}
          >
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </label>

        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
          <Editor
            height="40vh"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          style={{ ...styles.button, marginTop: '15px' }}
        >
          {isSubmitting ? 'Running...' : 'Submit Code'}
        </button>
        
        {/* --- Submission Status Display --- */}
        {/* This will show "Status: queued...", "Status: RUNNING...", 
            and finally "Finished: 0 / 3 passed." */}
        {submissionStatusText && (
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: submissionResult && submissionResult.passedTests === submissionResult.totalTests ? 'green' : 
                   submissionResult ? 'red' : '#555'
          }}>
            {submissionStatusText}
          </p>
        )}

        {/* --- Detailed Result Display (Already correct) --- */}
        {submissionResult && submissionResult.resultJson && (
            <div style={{marginTop: '15px'}}>
                <h4>Submission Details:</h4>
                <ul style={styles.list}>
                    {/* We must parse the resultJson string */}
                    {JSON.parse(submissionResult.resultJson).map((testCase) => (
                        <li key={testCase.testCaseId} style={{
                          ...styles.listItem, 
                          backgroundColor: testCase.passed ? '#e6ffed' : '#ffebee',
                          borderColor: testCase.passed ? '#b2fab4' : '#ffcdd2'
                        }}>
                            <strong>Test Case {testCase.testCaseId}:</strong> {testCase.passed ? 'Passed ✅' : 'Failed ❌'} <br />
                            <small>Expected: {testCase.expected}</small> <br />
                            <small>Got: {testCase.output}</small>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </div>
       <button onClick={()=>navigate(`/leaderboard/`+roomData.roomCode)}>leaderboard</button>
    </div>
  );
}

export default GamePageQuestion;