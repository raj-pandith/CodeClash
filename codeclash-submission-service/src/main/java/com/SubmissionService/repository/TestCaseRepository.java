package com.SubmissionService.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SubmissionService.dto.TestCase;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, String> {
    List<TestCase> findByQuestionId(String questionId);
}
