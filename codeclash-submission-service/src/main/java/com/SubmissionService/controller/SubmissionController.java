package com.SubmissionService.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.SubmissionService.dto.Submission;
import com.SubmissionService.dto.SubmitRequest;
import com.SubmissionService.repository.SubmissionRepository.LeaderboardProjection;
import com.SubmissionService.service.SubmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public Map<String, String> submit(@RequestBody SubmitRequest request) {
        String submissionId = submissionService.enqueueSubmission(request);
        if (submissionId != null) {
            return Map.of("submissionId", submissionId, "status", "queued");
        } else {
            return Map.of("submissionId", submissionId, "status", "already submitted");
        }
    }

    @GetMapping("/{submissionId}")
    public Submission getSubmission(@PathVariable String submissionId) {
        return submissionService.getSubmission(submissionId);
    }

    @GetMapping("/leaderboard/{roomId}")
    public List<LeaderboardProjection> getSubmissionRoom(@PathVariable String roomId) {
        return submissionService.getSubmissionOfRoomId(roomId);
    }

}
