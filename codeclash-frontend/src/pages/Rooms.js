import React, { useEffect, useState } from "react";
import { getAllRooms, createRoom } from "../api/roomApi";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    getAllRooms().then((res) => setRooms(res.data));
  }, []);

  const handleCreate = async () => {
    await createRoom({ name: newRoom });
    const res = await getAllRooms();
    setRooms(res.data);
  };

  return (
    <div className="p-4">
      <h2>All Rooms</h2>
      <input
        value={newRoom}
        onChange={(e) => setNewRoom(e.target.value)}
        placeholder="Enter room name"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {rooms.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
