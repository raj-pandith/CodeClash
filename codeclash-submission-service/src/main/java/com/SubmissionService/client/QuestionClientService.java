package com.SubmissionService.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.SubmissionService.dto.TestCaseDTO;

import java.util.List;

@Service
public class QuestionClientService {

    private final RestTemplate restTemplate;

    // Base URL for the question service
    private final String QUESTION_SERVICE_BASE_URL = "http://localhost:8081/questions";

    @Autowired
    public QuestionClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetches the list of test cases for a specific question ID.
     *
     * @param questionId The ID of the question.
     * @return A list of TestCaseDTO objects.
     */
    public List<TestCaseDTO> getTestCasesForQuestion(Integer questionId) {

        // 1. Build the full URL safely
        String url = UriComponentsBuilder
                .fromHttpUrl(QUESTION_SERVICE_BASE_URL)
                .path("/testcase/{id}")
                .buildAndExpand(questionId)
                .toUriString();

        // 2. Make the HTTP GET request
        ResponseEntity<List<TestCaseDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null, // No request body for a GET request
                new ParameterizedTypeReference<List<TestCaseDTO>>() {
                } // This is key!
        );

        // 3. Return the body of the response (which is the list)
        return response.getBody();
    }
}