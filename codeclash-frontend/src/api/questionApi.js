import axios from "axios";

const BASE_URL = "http://localhost:8082"; // your question-service port

export const getAllQuestions = () => axios.get(`${BASE_URL}/questions`);
export const getQuestionById = (id) => axios.get(`${BASE_URL}/questions/${id}`);
export const submitSolution = (id, code) => axios.post(`${BASE_URL}/questions/${id}/submit`, { code });
