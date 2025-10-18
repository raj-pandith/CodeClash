package com.CodeClashQuestionServiceApplication.repository;

import org.springframework.stereotype.Repository;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.model.TestCase;

import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class QuestionRepository {

    private List<Question> questions = new ArrayList<>();

    @PostConstruct
    public void init() {
        // Add some sample questions

        Question q1 = new Question();
        q1.setId("Q1");
        q1.setTitle("Two Sum");
        q1.setDifficulty("Medium");
        q1.setTestCases(List.of(
                new TestCase("2,7,11,15,9", "[0,1]"),
                new TestCase("3,2,4,6", "[1,2]")));

        Question q2 = new Question();
        q2.setId("Q2");
        q2.setTitle("Reverse Array");
        q2.setDifficulty("Easy");
        q2.setTestCases(List.of(
                new TestCase("[1,2,3,4]", "[4,3,2,1]")));

        questions.add(q1);
        questions.add(q2);
    }

    public List<Question> getQuestions(int number, String difficulty) {
        // Filter by difficulty
        List<Question> filtered = questions.stream()
                .filter(q -> q.getDifficulty().equalsIgnoreCase(difficulty))
                .collect(Collectors.toList());

        // Return up to 'number' questions
        return filtered.stream().limit(number).collect(Collectors.toList());
    }
}
