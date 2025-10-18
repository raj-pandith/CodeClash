package com.CodeClashRoomService.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Room {

    private String roomCode;
    private String host;
    private List<String> players;
    private List<String> questions; // question IDs
    private Map<String, PlayerStats> playerStats = new HashMap<>();
    private Long startTime;
    private String status; // waiting, running, finished
    private ContestSettings contestSettings;

    // getters and setters
}
