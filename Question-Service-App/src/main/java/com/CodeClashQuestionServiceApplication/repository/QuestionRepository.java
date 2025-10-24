package com.CodeClashQuestionServiceApplication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.CodeClashQuestionServiceApplication.model.Question;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM question_table q WHERE q.difficulty = :difficulty ORDER BY RAND()", nativeQuery = true)
    // FIX: Changed the 'int number' parameter to 'Pageable pageable'
    List<Question> findRandomQuestionsByDifficulty(
            @Param("difficulty") String difficulty,
            org.springframework.data.domain.Pageable pageable // <-- Spring will use this to add the 'LIMIT' clause
    );

    boolean existsByQuestionNumber(Long questionNumber);

    Optional<Question> findByQuestionNumber(Long questionNumber);

}
