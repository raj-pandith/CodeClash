import React, { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import GamePageQuestion from './pages/QuestionPage/GamePageQuestion.js';

import Leaderboard from './pages/leaderboardPage/Leaderboard.js';
import AddQuestionForm from './pages/forms/AddQuestionForm.js'
import HomePage from './pages/homepage/HomePage.js';
import LobbyPage from './pages/LobbyPage/LobbyPage.js'
import DeleteQuestionForm from './pages/forms/DeleteQuestionForm.js'
import Navbar from './components/Navbar.js';


function App() {
  const [roomData, setRoomData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
    <BrowserRouter>
      <Navbar></Navbar>
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
        <Route path="/delete" element={<DeleteQuestionForm />} />
      </Routes>
    </BrowserRouter>
          </>
  );
}

export default App;