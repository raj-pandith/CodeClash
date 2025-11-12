package com.CodeClashQuestionServiceApplication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity // <-- FIX 1: Added @Entity
@Table(name = "testcase_table")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // <-- FIX 2: Changed from String to Long

    private String input;
    private String expectedOutput;

    // This is the "owning" side of the relationship
    // It creates a 'question_id' column in 'testcase_table'
    @ManyToOne(fetch = FetchType.LAZY) // LAZY is often better for performance
    @JoinColumn(name = "question_id", nullable = false) // 'nullable = false' ensures a TestCase MUST have a Question
    @JsonIgnore
    private Question question;
}