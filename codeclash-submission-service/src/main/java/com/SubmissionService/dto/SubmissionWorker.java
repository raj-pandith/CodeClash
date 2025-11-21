package com.SubmissionService.dto;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.SubmissionService.client.QuestionClientService;
import com.SubmissionService.repository.SubmissionRepository;
import com.SubmissionService.template.templateImp.CppDockerRunner;
import com.SubmissionService.template.templateImp.JavaDockerRunner;
import com.SubmissionService.template.templateImp.PythonDockerRunner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubmissionWorker {

    private final StringRedisTemplate redisTemplate;
    private final SubmissionRepository submissionRepository;
    private final JavaDockerRunner javaRunner;
    private final CppDockerRunner cppRunner;
    private final PythonDockerRunner pythonRunner;

    // Inject the thread pool defined in Step 2
    @Autowired
    @Qualifier("submissionTaskExecutor")
    private Executor taskExecutor;

    @Autowired
    private QuestionClientService questionClientService;

    @Scheduled(fixedDelay = 2000)
    public void pollQueue() {
        while (true) {
            // 1. Attempt to pop a submission ID
            String submissionId = redisTemplate.opsForList().leftPop("submission:queue");

            // 2. If queue is empty, break the loop and wait for next schedule
            if (submissionId == null) {
                break;
            }

            // 3. Submit the processing task to the Thread Pool
            // This runs asynchronously and does not block this loop
            CompletableFuture.runAsync(() -> {
                processSubmissionById(submissionId);
            }, taskExecutor);
        }
    }

    private void processSubmissionById(String submissionId) {
        Submission submission = submissionRepository.findById(submissionId).orElse(null);
        if (submission == null) {
            log.warn("Submission ID {} not found in DB", submissionId);
            return;
        }
        processSubmission(submission);
    }

    private void processSubmission(Submission submission) {
        try {
            submission.setStatus("RUNNING");
            submissionRepository.save(submission);

            List<TestCaseDTO> testCases = questionClientService.getTestCasesForQuestion(submission.getQuestionNumber());
            int passed = 0;
            int total = testCases.size();
            JSONArray results = new JSONArray();

            for (TestCaseDTO tc : testCases) {
                String output = runCodeByLanguage(submission.getCode(), tc.getInput(), submission.getLanguage());
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

    private String runCodeByLanguage(String code, String input, String language) throws Exception {
        return switch (language.toLowerCase()) {
            case "java" -> javaRunner.runCodeWithInput(code, input);
            case "cpp" -> cppRunner.runCodeWithInput(code, input);
            case "python" -> pythonRunner.runCodeWithInput(code, input);
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }
}
