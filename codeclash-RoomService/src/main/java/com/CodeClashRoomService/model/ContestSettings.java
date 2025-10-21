package com.CodeClashRoomService.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

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
@JsonDeserialize
@JsonSerialize
public class ContestSettings {
    private int numberOfQuestions;
    private String difficulty; // "Easy", "Medium", "Hard"

    // getters and setters
}
