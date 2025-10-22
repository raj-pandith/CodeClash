package com.SubmissionService.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class TestCase {
    @Id
    private String id;
    private String questionId;
    private String input;
    private String expectedOutput;
}
