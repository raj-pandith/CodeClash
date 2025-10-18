package com.CodeClashRoomService.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ContestSettings {
    private int numberOfQuestions;
    private String difficulty; // "Easy", "Medium", "Hard"

    // getters and setters
}
