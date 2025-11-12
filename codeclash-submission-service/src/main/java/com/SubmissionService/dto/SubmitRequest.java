package com.SubmissionService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitRequest {
    private String playerId;
    private String roomCode;
    private Long questionNumber;
    private String language;
    private String code; // Base64 encoded
}
