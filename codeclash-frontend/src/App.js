import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import GamePageQuestion from './pages/QuestionPage/GamePageQuestion.js';

import Leaderboard from './pages/leaderboardPage/Leaderboard.js';
import AddQuestionForm from './pages/AddQuestionForm.js'
import HomePage from './pages/homepage/HomePage.js';
import LobbyPage from './pages/LobbyPage/LobbyPage.js'


function App() {
  const [roomData, setRoomData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage setRoomData={setRoomData} setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/lobby"
          element={<LobbyPage roomData={roomData} setRoomData={setRoomData} currentUser={currentUser} />}
        />
        <Route
          path="/game"
          element={<GamePageQuestion roomData={roomData} currentUser={currentUser} />}
        />
        <Route path="/leaderboard/:roomCode" element={<Leaderboard />} />
        <Route path="/add-question" element={<AddQuestionForm/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;