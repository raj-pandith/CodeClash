package com.CodeClashQuestionServiceApplication.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Repository;

import com.CodeClashQuestionServiceApplication.model.Question;

import java.util.List;

@Repository
public class QuestionRepositoryCustomImpl implements QuestionRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Question> findRandomQuestions(String difficulty, int limit) {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(
                        org.springframework.data.mongodb.core.query.Criteria
                                .where("difficulty").is(difficulty)),
                Aggregation.sample(limit));

        return mongoTemplate.aggregate(
                aggregation,
                "questions", // collection name
                Question.class).getMappedResults();
    }
}