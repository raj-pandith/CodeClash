package com.SubmissionService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.SubmissionService.dto.Submission;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {

    // 1. UPDATE THE PROJECTION INTERFACE
    // We need to add a getter for the new "earliestPass" column
    public interface LeaderboardProjection {
        String getPlayerId();

        int getSolvedQuestionsCount();

        Long getEarliestPass();
    }

    Optional<Submission> findByPlayerIdAndRoomCodeAndQuestionNumber(
            String playerId, String roomCode, Long questionNumber);



    @Query(value = """
            SELECT
                s.player_id AS playerId,
                COUNT(DISTINCT s.question_number) AS solvedQuestionsCount,
                MAX(s.submitted_at) AS earliestPass
            FROM submission s
            WHERE s.verdict = 'PASS'
              AND s.room_code = :roomId
            GROUP BY s.player_id
            ORDER BY solvedQuestionsCount DESC, earliestPass ASC;
            """, nativeQuery = true)
    List<LeaderboardProjection> getLeaderboardByRoomCode(@Param("roomId") String roomId);
}