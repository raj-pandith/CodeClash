package com.CodeClashQuestionServiceApplication.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.model.QuestionsDifficultySetting;
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

    public List<TestCase> getAllTestCaseByQuestionNumber(Long questionNumber) {
        Optional<Question> foundQuestion = questionRepository.findByQuestionNumber(questionNumber);
        List<TestCase> list = foundQuestion.get().getTestCases();
        return list;

    }

    public List<Question> getQuestionByAllDifficulty(QuestionsDifficultySetting questionsDifficultySetting) {
        int easy = questionsDifficultySetting.getEasy();
        int medium = questionsDifficultySetting.getMedium();
        int hard = questionsDifficultySetting.getHard();

        List<Question> all = new ArrayList<>();
        if (easy > 0) {
            org.springframework.data.domain.Pageable pageableEasy = PageRequest.of(0, easy);
            List<Question> listOfEasy = questionRepository.findRandomQuestionsByDifficulty("Easy", pageableEasy);
            all.addAll(listOfEasy);
        }
        if (medium > 0) {
            org.springframework.data.domain.Pageable pageableMedium = PageRequest.of(0, medium);
            List<Question> listOfMedium = questionRepository.findRandomQuestionsByDifficulty("Medium", pageableMedium);
            all.addAll(listOfMedium);
        }
        if (hard > 0) {
            org.springframework.data.domain.Pageable pageableHard = PageRequest.of(0, hard);
            List<Question> listOfHard = questionRepository.findRandomQuestionsByDifficulty("Hard", pageableHard);
            all.addAll(listOfHard);
        }
        return all;
    }

    public Question findQuestion(Long questionNumber) {
        Optional<Question> found = questionRepository.findByQuestionNumber(questionNumber);
        if (found.isPresent()) {
            return found.get();
        } else {
            return null;
        }
    }

}
