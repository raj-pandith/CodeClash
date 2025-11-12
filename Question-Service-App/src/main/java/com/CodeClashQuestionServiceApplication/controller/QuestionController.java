package com.CodeClashQuestionServiceApplication.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.CodeClashQuestionServiceApplication.model.Question;
import com.CodeClashQuestionServiceApplication.model.QuestionsDifficultySetting;
import com.CodeClashQuestionServiceApplication.model.TestCase;
import com.CodeClashQuestionServiceApplication.repository.QuestionRepository;
import com.CodeClashQuestionServiceApplication.service.QuestionService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionRepository questionRepository;

    @GetMapping
    public ResponseEntity<List<Question>> getQuestionBasedOnSettings(@RequestParam int number,
            @RequestParam String difficulty) {
        return new ResponseEntity<>(
                questionService.getQuestionBasedOnHostSettings(number, difficulty), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Question> addQuestionWithTestCase(@RequestBody Question newQuestion) {
        try {

            Question added = questionService.addQuestionWithTestCase(newQuestion);
            if (added == null) {
                return new ResponseEntity<>(added, HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>(added, HttpStatus.OK);
            }
        } catch (Exception e) {
            Question question = null;
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
    }

    @GetMapping("/testcase/{questionNumber}")
    public ResponseEntity<?> getTestCaseByQuestionNumber(@PathVariable Long questionNumber) {
        try {

            List<TestCase> list = questionService.getAllTestCaseByQuestionNumber(questionNumber);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("question testcase not found", HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE question by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        try {
            return questionRepository.findById(id).map(question -> {
                questionRepository.delete(question);
                return ResponseEntity.ok("Question deleted successfully with id: " + id);
            }).orElseGet(() -> ResponseEntity.status(404).body("Question not found with id: " + id));
        } catch (Exception e) {
            return new ResponseEntity("question id" + id + " doesn't exist", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/question-all-types-random")
    public ResponseEntity<List<Question>> getAllTypeQuestions(
            @RequestBody QuestionsDifficultySetting questionsDifficultySetting) {
        List<Question> list = questionService.getQuestionByAllDifficulty(questionsDifficultySetting);
        return new ResponseEntity<>(list, HttpStatus.ACCEPTED);

    }

    @PostMapping("/by-numbers")
    public ResponseEntity<List<Question>> getQuestionsByNumbers(@RequestBody List<String> questionNumbers) {
        System.out.println("in side /by-numbers ");
        List<Long> questionIdsAsLong = questionNumbers.stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());

        System.out.println("converted to List<String> to List<Itneger>");

        List<Question> questions = questionRepository.findAllByQuestionNumberIn(questionIdsAsLong);

        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionNumber, q -> q));

        List<Question> orderedQuestions = questionIdsAsLong.stream()
                .map(questionMap::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        System.out.println("sending the question from the room controller to frontend ...........................");

        return new ResponseEntity<>(orderedQuestions, HttpStatus.OK);
    }

    @GetMapping("/all-questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return new ResponseEntity<>(questionRepository.findAll(), HttpStatus.OK);
    }

}
