package com.CodeClashRoomService.Repository;

import org.springframework.stereotype.Repository;

import com.CodeClashRoomService.model.Room;

import java.util.HashMap;
import java.util.Map;

@Repository
public class RoomRepository {
    private Map<String, Room> rooms = new HashMap<>();

    public void save(Room room) {
        rooms.put(room.getRoomCode(), room);
    }

    public Room findByCode(String code) {
        return rooms.get(code);
    }

    public void delete(String code) {
        rooms.remove(code);
    }
}
