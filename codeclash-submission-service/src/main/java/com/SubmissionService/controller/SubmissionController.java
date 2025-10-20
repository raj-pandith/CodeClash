package com.SubmissionService.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.SubmissionService.dto.SubmitRequest;
import com.SubmissionService.service.SubmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public Map<String, String> submit(@RequestBody SubmitRequest request) {
        String submissionId = submissionService.enqueueSubmission(request);
        return Map.of(
                "submissionId", submissionId,
                "status", "queued");
    }
}