package com.SubmissionService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SubmissionService.dto.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
}
