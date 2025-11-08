import { Editor } from '@monaco-editor/react';
import { QUESTION_API_BASE_URL, SUBMISSION_API_BASE_URL } from "../../api/apis";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import gamePageStyle from "./style/gamePageStyle";

function GamePageQuestion({ roomData, currentUser }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(
`import java.util.*;
public class Main {
    public static void main(String[] args) {
        
    }
}`);
  const [language, setLanguage] = useState('java');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionStatusText, setSubmissionStatusText] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomData || !roomData.contestSettings) {
      navigate('/lobby');
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${QUESTION_API_BASE_URL}/questions/question-all-types-random`,
          {
            easy: roomData.contestSettings.easy,
            medium: roomData.contestSettings.medium,
            hard: roomData.contestSettings.hard,
          }
        );
        setQuestions(response.data);
      } catch (err) {
        setError('Could not load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [roomData, navigate]);

  const pollForResult = async (submissionId) => {
    try {
      const res = await axios.get(`${SUBMISSION_API_BASE_URL}/submissions/${submissionId}`);
      const data = res.data;

      if (['FINISHED', 'ERROR', 'FAILED'].includes(data.status)) {
        setIsSubmitting(false);
        setSubmissionResult(data);
        setSubmissionStatusText(`Finished: ${data.passedTests} / ${data.totalTests} passed.`);
      } else {
        setSubmissionStatusText(`Status: ${data.status}...`);
        setTimeout(() => pollForResult(submissionId), 2000);
      }
    } catch {
      setIsSubmitting(false);
      setSubmissionStatusText('Error fetching results. Please try again.');
    }
  };

  const handleSubmitCode = async () => {
    if (isSubmitting || !questions[selectedQuestionIndex]) return;

    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionStatusText('Submitting code...');

    const selectedQuestion = questions[selectedQuestionIndex];
    const payload = {
      playerId: currentUser,
      roomCode: roomData.roomCode,
      questionNumber: selectedQuestion.questionNumber,
      language,
      code: btoa(code),
    };

    try {
      const response = await axios.post(`${SUBMISSION_API_BASE_URL}/submissions`, payload);
      const { submissionId, status } = response.data;
      if (submissionId) {
        setSubmissionStatusText(`Status: ${status}...`);
        pollForResult(submissionId);
      } else {
        setSubmissionStatusText('Could not get submission ID.');
        setIsSubmitting(false);
      }
    } catch {
      setSubmissionStatusText('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!roomData) return <Navigate to="/" replace />;
  if (roomData.status !== 'running') return <Navigate to="/lobby" replace />;
  if (loading) return <div style={gamePageStyle.container}><h2>Loading Questions...</h2></div>;
  if (error) return <div style={gamePageStyle.container}><h2 style={gamePageStyle.error}>{error}</h2></div>;

  const selectedQuestion = questions[selectedQuestionIndex];

  return (
    
    <div style={gamePageStyle.container}>
      <div style={gamePageStyle.questionSection}>
        <div style={gamePageStyle.tabContainer}>
          {questions.map((q, index) => (
            <button
              key={q.questionNumber}
              onClick={() => setSelectedQuestionIndex(index)}
              style={{
                ...gamePageStyle.tabButton,
                backgroundColor: index === selectedQuestionIndex ? '#00bcd4' : '#222',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div style={gamePageStyle.questionBox}>
          <h3>Q{selectedQuestion.questionNumber}. {selectedQuestion.title}</h3>
          <p style={gamePageStyle.difficulty}>{selectedQuestion.difficulty.toUpperCase()}</p>
          <h4>Description</h4>
          <p>{selectedQuestion.description}</p>
          <h4>Input Format</h4>
          <p>{selectedQuestion.inputFormate}</p>
          <h4>Test Case</h4>
          {selectedQuestion.testCases.length > 0 && (
            <div style={gamePageStyle.testCaseBox}>
              <strong>Input:</strong> {selectedQuestion.testCases[0].input}<br />
              <strong>Expected Output:</strong> {selectedQuestion.testCases[0].expectedOutput}
            </div>
          )}
          {selectedQuestion.testCases.length > 1 && (
            <div style={gamePageStyle.testCaseBox}>
              <strong>Input:</strong> {selectedQuestion.testCases[1].input}<br />
              <strong>Expected Output:</strong> {selectedQuestion.testCases[1].expectedOutput}
            </div>
          )}
        </div>
      </div>

      <div style={gamePageStyle.editorSection}>
        <div style={gamePageStyle.editorHeader}>
          <label style={gamePageStyle.label}>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={gamePageStyle.select}
            >
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>

        <Editor
          height="40vh"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          />

      <div style={{display:"flex",gap:"5%"}}>

        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          style={gamePageStyle.submitButton}
          >
          {isSubmitting ? 'Running...' : 'Submit Code'}
        </button>

         <button onClick={() => navigate(`/leaderboard/${roomData.roomCode}`)} style={gamePageStyle.leaderboardBtn}>
          Leaderboard
        </button>

          </div>
        {submissionStatusText && (
          <p style={{
            color: submissionResult && submissionResult.passedTests === submissionResult.totalTests ? '#00e676' :
            submissionResult ? '#ff5252' : '#bbb',
            fontWeight: 'bold',
            marginTop: '10px'
          }}>
            {submissionStatusText}
          </p>
        )}

        {submissionResult && submissionResult.resultJson && (
          <div style={gamePageStyle.resultBox}>
            <h4>Submission Details:</h4>
            <ul style={gamePageStyle.resultList}>
              {JSON.parse(submissionResult.resultJson).map((testCase) => (
                <li key={testCase.testCaseId} style={{
                  ...gamePageStyle.resultItem,
                  backgroundColor: testCase.passed ? '#1b5e20' : '#b71c1c',
                }}>
                  <strong>Test Case {testCase.testCaseId}: </strong>
                  {testCase.passed ? '✅ Passed' : '❌ Failed'} <br />
                  <small>Expected: {testCase.expected}</small> <br />
                  <small>Got: {testCase.output}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
       
      </div>
    </div>
  );
}

export default GamePageQuestion;
