package com.SubmissionService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitRequest {
    private String playerId;
    private String roomCode;
    private String questionId;
    private String language;
    private String code;
}
