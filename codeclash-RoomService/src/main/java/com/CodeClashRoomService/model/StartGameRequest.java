package com.CodeClashRoomService.model;

import lombok.Data;
import java.util.List;

@Data // @Data includes @Getter, @Setter, @ToString, @NoArgsConstructor, etc.
public class StartGameRequest {

    // This field tells you which mode is active: "RANDOM" or "MANUAL"
    private String selectionMode;

    // This will hold the { "easy": 1, "medium": 1, "hard": 1 } object
    // It will be null if selectionMode is "MANUAL"
    private ContestSettings difficultySettings;

    // This will hold the [3, 5, 8] list
    // It will be null if selectionMode is "RANDOM"
    private List<Integer> questionNumbers;
}