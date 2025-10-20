package com.SubmissionService.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.SubmissionService.dto.Submission;
import com.SubmissionService.dto.SubmitRequest;
import com.SubmissionService.repository.SubmissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository repository;
    private final StringRedisTemplate redisTemplate;

    public String enqueueSubmission(SubmitRequest request) {
        String submissionId = UUID.randomUUID().toString();
        // Decode Base64 code
        String decodedCode = new String(Base64.getDecoder().decode(request.getCode()), StandardCharsets.UTF_8);

        Submission submission = new Submission();
        submission.setId(submissionId);
        submission.setPlayerId(request.getPlayerId());
        submission.setRoomCode(request.getRoomCode());
        submission.setQuestionId(request.getQuestionId());
        submission.setLanguage(request.getLanguage());
        submission.setStatus("QUEUED");
        submission.setSubmittedAt(System.currentTimeMillis());
        submission.setCode(decodedCode);
        repository.save(submission);

        // push submissionId to Redis queue
        redisTemplate.opsForList().rightPush("submission:queue", submissionId);

        return submissionId;
    }
}
