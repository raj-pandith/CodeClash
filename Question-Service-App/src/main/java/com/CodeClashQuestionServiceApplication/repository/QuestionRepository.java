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

        Question q2 = new Question();
        q2.setId("Q2_REV_ARR");
        q2.setTitle("Reverse Array");
        q2.setDifficulty("Easy");
        q2.setTestCases(List.of(
                new TestCase("1 2 3 4", "4 3 2 1")));

     Question q3 = new Question();
        q3.setId("Q_ADD");
        q3.setTitle("ADD two Number");
        q3.setDifficulty("Easy");
        q3.setTestCases(List.of(
                new TestCase("2 3", "5")));
        

        questions.add(q2);
        questions.add(q3);
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
