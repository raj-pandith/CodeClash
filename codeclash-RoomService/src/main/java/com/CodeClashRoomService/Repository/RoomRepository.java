package com.CodeClashRoomService.Repository;

import org.springframework.stereotype.Repository;

import com.CodeClashRoomService.model.Room;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByRoomCode(String roomCode);
}
