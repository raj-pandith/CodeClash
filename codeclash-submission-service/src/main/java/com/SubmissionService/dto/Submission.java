package com.SubmissionService.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Entity
@Data
public class Submission {
    @Id
    private String id;
    private String playerId;
    private String roomCode;
    private Long questionNumber;
    private String language;
    @Lob
    private String code;
    private String status; // QUEUED, RUNNING, FINISHED, FAILED
    private int passedTests;
    private int totalTests;
    @Lob
    private String resultJson;
    private long submittedAt;
    private long completedAt;
    private String verdict;
}
