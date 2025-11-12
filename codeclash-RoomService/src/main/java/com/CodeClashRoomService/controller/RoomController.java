package com.CodeClashRoomService.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.CodeClashRoomService.Repository.RoomRepository;
import com.CodeClashRoomService.client.QuestionServiceClient;
import com.CodeClashRoomService.model.ContestSettings;
import com.CodeClashRoomService.model.PlayerStats;
import com.CodeClashRoomService.model.Room;
import com.CodeClashRoomService.model.StartGameRequest;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    private final QuestionServiceClient questionService;

    private final SimpMessagingTemplate messagingTemplate;

    private String generateRoomCode() {
        return new Random().ints(6, 0, 36)
                .mapToObj(i -> Integer.toString(i, 36))
                .reduce("", String::concat).toUpperCase();
    }

    // Create Room
    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestParam String hostName) {

        System.out.println("create room request in backend");

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

        Room savedRoom = roomRepository.save(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    // Join Room
    @PostMapping("/join")
    public Room joinRoom(@RequestParam String roomCode, @RequestParam String playerName) {
        Optional<Room> roomBox = roomRepository.findByRoomCode(roomCode);
        Room room = roomBox.get();
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
    public ResponseEntity<Room> startContest(@RequestParam String roomCode,
            @RequestBody StartGameRequest request) { // <-- Use the new class

        System.out.println("Got request to start game: " + request);
        Optional<Room> roomBox = roomRepository.findByRoomCode(roomCode);

        if (!roomBox.isPresent()) {
            System.out.println("Error: Room not found with code: " + roomCode);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        System.out.println("room fetched from the database................. ");
        Room room = roomBox.get();
        List<String> finalQuestionNumbers;

        System.out.println("identifing the game mode of request ................");

        if ("RANDOM".equals(request.getSelectionMode())) {
            // --- RANDOM MODE LOGIC ---
            System.out.println("Starting in RANDOM mode");
            ContestSettings settings = request.getDifficultySettings();

            // This is your original logic
            finalQuestionNumbers = questionService.getAllQuestionType(
                    settings.getEasy(), settings.getMedium(), settings.getHard());

            // Save the settings object (e.g., {easy: 1, medium: 1, hard: 1})
            room.setContestSettings(settings);

        } else if ("MANUAL".equals(request.getSelectionMode())) {
            // --- MANUAL MODE LOGIC ---
            System.out.println("Starting in MANUAL mode");
            List<Integer> manualQuestionIds = request.getQuestionNumbers();

            // Convert List<Integer> to List<String> to match your Room entity
            finalQuestionNumbers = manualQuestionIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toList());

            // In manual mode, there are no difficulty settings, so we can set null
            room.setContestSettings(null);

        } else {
            System.out.println("Error: Invalid selection mode: " + request.getSelectionMode());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // --- Common logic from your old method ---
        room.setStatus("running");
        room.setStartTime(System.currentTimeMillis());
        room.setQuestionsNumbers(finalQuestionNumbers); // <-- Set the list from our if/else logic

        roomRepository.save(room);

        // Broadcast to all players
        messagingTemplate.convertAndSend("/topic/" + roomCode + "/start", room);

        System.out.println("Starting room .....");
        System.out.println(room);

        // Return the updated room with a 200 OK status
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

}
