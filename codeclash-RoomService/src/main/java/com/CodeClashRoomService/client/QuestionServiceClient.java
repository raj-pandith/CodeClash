package com.CodeClashRoomService.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.CodeClashRoomService.model.ContestSettings;
import com.CodeClashRoomService.model.Question;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
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

    public List<String> getAllQuestionType(int easy, int medium, int hard) {
        String url = "http://localhost:8081/questions/question-all-types-random";

        // 2. Create the request body object
        ContestSettings requestBody = new ContestSettings();
        requestBody.setEasy(easy);
        requestBody.setMedium(medium);
        requestBody.setHard(hard);

        // 3. Set headers (e.g., Content-Type)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ContestSettings> requestEntity = new HttpEntity<>(requestBody, headers);

        // 5. Define the expected response type (a List of Questions)
        // We use ParameterizedTypeReference to correctly capture generic types like
        // List<>
        ParameterizedTypeReference<List<Question>> responseType = new ParameterizedTypeReference<List<Question>>() {
        };

        try {
            // 6. Execute the request using exchange()
            ResponseEntity<List<Question>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity, // Pass in our entity (with the body)
                    responseType // Specify the list response type
            );

            // 7. Return the body from the response
            List<String> questionIds = new ArrayList<>();
            for (int i = 0; i < response.getBody().size(); i++) {
                Question quest = response.getBody().get(i);
                questionIds.add(quest.getId());
            }
            return questionIds;

        } catch (Exception e) {
            // Handle exceptions (e.g., service unavailable, 404)
            System.err.println("Error fetching questions: " + e.getMessage());
            return null;
        }

    }
}
