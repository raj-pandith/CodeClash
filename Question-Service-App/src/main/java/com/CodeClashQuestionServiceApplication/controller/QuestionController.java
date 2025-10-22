package com.CodeClashQuestionServiceApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.repository.QuestionRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public List<Question> getQuestions(@RequestParam int number,
            @RequestParam String difficulty) {
        return questionRepository.getQuestions(number, difficulty);
    }
}
