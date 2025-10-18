package com.CodeClashRoomService.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.CodeClashRoomService.model.Question;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceClient {

    private final RestTemplate restTemplate;

    // Replace with your Question Service URL
    private final String QUESTION_SERVICE_URL = "http://localhost:8081/questions";

    public List<String> getQuestions(int number, String difficulty) {
        String url = QUESTION_SERVICE_URL + "?number=" + number + "&difficulty=" + difficulty;

        Question[] questions = restTemplate.getForObject(url, Question[].class);

        if (questions == null)
            return List.of();

        // Return only question IDs
        return Arrays.stream(questions)
                .map(Question::getId)
                .collect(Collectors.toList());
    }
}
