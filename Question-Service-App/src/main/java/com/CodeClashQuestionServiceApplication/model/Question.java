package com.CodeClashQuestionServiceApplication.model;

import java.util.List;

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
public class Question {
    private String id;
    private String title;
    private String difficulty; // "Easy", "Medium", "Hard"
    private List<TestCase> testCases;

    // getters and setters
}