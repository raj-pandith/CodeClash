package com.CodeClashQuestionServiceApplication.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.ArrayList;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "question_table")
public class Question {

    @Id
    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionNumber;

    private String title;
    private String description;
    private String difficulty; // "Easy", "Medium", "Hard"
    private String inputFormate;
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER // Use
                                                                                                               // EAGER
                                                                                                               // or
                                                                                                               // LAZY
                                                                                                               // based
                                                                                                               // on
                                                                                                               // your
                                                                                                               // needs
    )
    private List<TestCase> testCases = new ArrayList<>(); // Always initialize collections

    public void addTestCase(TestCase testCase) {
        testCases.add(testCase);
        testCase.setQuestion(this);
    }

    public void removeTestCase(TestCase testCase) {
        testCases.remove(testCase);
        testCase.setQuestion(null);
    }
}