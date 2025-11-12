package com.CodeClashRoomService.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.CodeClashRoomService.converter.ContestSettingsConverter;
import com.CodeClashRoomService.converter.PlayerStatsMapConverter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.*;
import java.util.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rooms")
@ToString
public class Room {

    @Id
    private String roomCode;

    private String host;

    @ElementCollection
    @CollectionTable(name = "room_players", joinColumns = @JoinColumn(name = "room_code"))
    @Column(name = "player")
    private List<String> players;

    @ElementCollection
    @CollectionTable(name = "room_questions", joinColumns = @JoinColumn(name = "room_code"))
    @Column(name = "question_id")
    private List<String> questionsNumbers; // question IDs

    // Storing a Map as JSON
    @Convert(converter = PlayerStatsMapConverter.class)
    private Map<String, PlayerStats> playerStats = new HashMap<>();

    private Long startTime;

    private String status; // waiting, running, finished

    @Convert(converter = ContestSettingsConverter.class)
    private ContestSettings contestSettings;
}
