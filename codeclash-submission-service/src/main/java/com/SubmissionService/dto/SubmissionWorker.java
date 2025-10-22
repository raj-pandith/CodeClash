package com.SubmissionService.dto;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.SubmissionService.repository.SubmissionRepository;
import com.SubmissionService.repository.TestCaseRepository;
import com.SubmissionService.service.DockerRunner;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubmissionWorker {

    private final StringRedisTemplate redisTemplate;
    private final SubmissionRepository submissionRepository;
    private final TestCaseRepository testCaseRepository;
    private final DockerRunner dockerRunner;

    @Scheduled(fixedDelay = 2000)
    public void pollQueue() {
        String submissionId = redisTemplate.opsForList().leftPop("submission:queue");
        if (submissionId == null)
            return;

        Submission submission = submissionRepository.findById(submissionId).orElse(null);
        if (submission == null)
            return;

        processSubmission(submission);
    }

    private void processSubmission(Submission submission) {
        try {
            submission.setStatus("RUNNING");
            submissionRepository.save(submission);

            List<TestCase> testCases = testCaseRepository.findByQuestionId(submission.getQuestionId());
            int passed = 0;
            int total = testCases.size();
            JSONArray results = new JSONArray();

            for (TestCase tc : testCases) {
                String output = dockerRunner.runJavaCodeWithInput(submission.getCode(), tc.getInput());
                boolean isPassed = output.equals(tc.getExpectedOutput().trim());
                if (isPassed)
                    passed++;

                JSONObject obj = new JSONObject();
                obj.put("testCaseId", tc.getId());
                obj.put("passed", isPassed);
                obj.put("output", output);
                obj.put("expected", tc.getExpectedOutput());
                results.put(obj);
            }

            submission.setPassedTests(passed);
            submission.setTotalTests(total);
            submission.setResultJson(results.toString());
            submission.setStatus("FINISHED");
            submission.setVerdict(passed == total ? "PASS" : "FAILED");
            submission.setCompletedAt(System.currentTimeMillis());
            submissionRepository.save(submission);

        } catch (Exception e) {
            submission.setStatus("FAILED");
            submission.setVerdict("runtime_error");
            submissionRepository.save(submission);
            e.printStackTrace();
        }
    }
}
