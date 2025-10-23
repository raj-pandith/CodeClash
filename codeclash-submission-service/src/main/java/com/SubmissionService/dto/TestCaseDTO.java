package com.SubmissionService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Using Lombok, which you've used before
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseDTO {

    private Long id;
    private String input;
    private String expectedOutput;

    // If not using Lombok, add getters, setters,
    // and a no-args constructor
}
