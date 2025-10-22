import axios from "axios";

const BASE_URL = "http://localhost:8080"; // your room-service port

export const createRoom = (data) => axios.post(`${BASE_URL}room/create`, data);
export const getAllRooms = () => axios.get(`${BASE_URL}/rooms`);
export const joinRoom = (roomId, user) => axios.post(`${BASE_URL}/rooms/${roomId}/join`, { user });
