package com.CodeClashQuestionServiceApplication.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.model.TestCase;
import com.CodeClashQuestionServiceApplication.service.QuestionService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getQuestionBasedOnSettings(@RequestParam int number,
            @RequestParam String difficulty) {
        return new ResponseEntity<>(
                questionService.getQuestionBasedOnHostSettings(number, difficulty), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Question> addQuestionWithTestCase(@RequestBody Question newQuestion) {
        Question added = questionService.addQuestionWithTestCase(newQuestion);
        if (added == null) {
            return new ResponseEntity<>(added, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(added, HttpStatus.OK);
        }
    }

    @GetMapping("/testcase/{questionNumber}")
    public ResponseEntity<List<TestCase>> getTestCaseByQuestionNumber(@PathVariable int questionNumber) {
        List<TestCase> list = questionService.getAllTestCaseByQuestionNumber(questionNumber);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
