package com.CodeClashQuestionServiceApplication.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.model.TestCase;
import com.CodeClashQuestionServiceApplication.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    public List<Question> getQuestionBasedOnHostSettings(int number, String difficulty) {

        // 1. Create a Pageable request.
        // PageRequest.of(page, size)
        // '0' = the first page
        // 'number' = the maximum number of items to return (your limit)
        org.springframework.data.domain.Pageable pageable = PageRequest.of(0, number);

        // 2. Pass the Pageable object to your updated repository method
        return questionRepository.findRandomQuestionsByDifficulty(difficulty, pageable);
    }

    public Question addQuestionWithTestCase(Question newQuestion) {

        if (questionRepository.existsByQuestionNumber(newQuestion.getQuestionNumber())) {
            return null;
        }

        // --- THIS IS THE CRITICAL STEP ---
        // Before saving the Question, you must set the 'question' field
        // on each 'TestCase' object. This sets up the foreign key.
        if (newQuestion.getTestCases() != null) {
            for (TestCase testCase : newQuestion.getTestCases()) {
                testCase.setQuestion(newQuestion); // Link the child to the parent
            }
        }

        // When you save the 'newQuestion' (the parent),
        // CascadeType.ALL will automatically save all the 'testCases' (the children)
        // in the same transaction.
        return questionRepository.save(newQuestion);
    }

    public List<TestCase> getAllTestCaseByQuestionNumber(int questionNumber) {
        Question foundQuestion = questionRepository.findByQuestionNumber(questionNumber);
        List<TestCase> list = foundQuestion.getTestCases();
        return list;

    }

}
