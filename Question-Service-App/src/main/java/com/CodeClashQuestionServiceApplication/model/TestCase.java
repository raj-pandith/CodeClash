package com.CodeClashQuestionServiceApplication.model;

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
public class TestCase {
    private String input;
    private String expectedOutput;
    // getters and setters
}