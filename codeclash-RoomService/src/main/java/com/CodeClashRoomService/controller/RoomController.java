package com.CodeClashRoomService.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.CodeClashRoomService.Repository.RoomRepository;
import com.CodeClashRoomService.client.QuestionServiceClient;
import com.CodeClashRoomService.model.ContestSettings;
import com.CodeClashRoomService.model.PlayerStats;
import com.CodeClashRoomService.model.Room;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    private final QuestionServiceClient questionService;

    private final SimpMessagingTemplate messagingTemplate; // for WebSocket

    private String generateRoomCode() {
        return new Random().ints(6, 0, 36)
                .mapToObj(i -> Integer.toString(i, 36))
                .reduce("", String::concat).toUpperCase();
    }

    // Create Room
    @PostMapping("/create")
    public Room createRoom(@RequestParam String hostName) {
        String roomCode = generateRoomCode();
        Room room = new Room();
        room.setRoomCode(roomCode);
        room.setHost(hostName);
        List<String> players = new ArrayList<>();
        players.add(hostName);
        room.setPlayers(players);
        room.setStatus("waiting");
        room.setPlayerStats(new HashMap<>() {
            {
                put(hostName, new PlayerStats());
            }
        });

        roomRepository.save(room);
        return room;
    }

    // Join Room
    @PostMapping("/join")
    public Room joinRoom(@RequestParam String roomCode, @RequestParam String playerName) {
        Room room = roomRepository.findByCode(roomCode);
        if (room != null && !room.getPlayers().contains(playerName)) {

            room.getPlayers().add(playerName);
            room.getPlayerStats().put(playerName, new PlayerStats());
            roomRepository.save(room);

            // WebSocket broadcast to all players in room
            messagingTemplate.convertAndSend("/topic/" + roomCode + "/players", room.getPlayers());
        }
        return room;
    }

    @PostMapping("/start")
    public Room startContest(@RequestParam String roomCode, @RequestBody ContestSettings settings) {
        Room room = roomRepository.findByCode(roomCode);
        if (room != null) {
            room.setStatus("running");
            room.setStartTime(System.currentTimeMillis());
            room.setContestSettings(settings);

            // Call Question Service
            List<String> questionIds = questionService.getQuestions(
                    settings.getNumberOfQuestions(),
                    settings.getDifficulty());
            room.setQuestions(questionIds);

            roomRepository.save(room);

            // Broadcast to all players
            messagingTemplate.convertAndSend("/topic/" + roomCode + "/start", room);
        }
        return room;
    }

}
