import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionById, submitSolution } from "../api/questionApi";

export default function Question() {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    getQuestionById(id).then((res) => setQuestion(res.data));
  }, [id]);

  const handleSubmit = async () => {
    const res = await submitSolution(id, code);
    setOutput(res.data.output);
  };

  return (
    <div className="p-4">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
      
      <textarea
        rows="10"
        cols="80"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleSubmit}>Run Code</button>

      {output && <pre>{output}</pre>}
    </div>
  );
}
