package com.CodeClashQuestionServiceApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CodeClashQuestionServiceApplication.model.TestCase;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

}
