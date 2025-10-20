package com.SubmissionService.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id
    private String id; // UUID

    private String playerId;
    private String roomCode;
    private String questionId;
    private String language; // java
    private String status; // QUEUED / RUNNING / FINISHED / FAILED
    private String verdict; // accepted / wrong_answer / compile_error / tle
    private int passedTests;
    private int totalTests;
    private long submittedAt;
    private long completedAt;
    private String code;

    @Lob
    private String resultJson; // per-test results
}
