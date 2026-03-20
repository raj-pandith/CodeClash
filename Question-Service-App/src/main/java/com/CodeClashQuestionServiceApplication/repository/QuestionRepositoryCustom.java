package com.CodeClashQuestionServiceApplication.repository;

import java.util.List;

import com.CodeClashQuestionServiceApplication.model.Question;

public interface QuestionRepositoryCustom {
    List<Question> findRandomQuestions(String difficulty, int limit);
}
