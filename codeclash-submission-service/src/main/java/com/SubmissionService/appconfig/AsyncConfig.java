package com.SubmissionService.appconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {

    // 👇 THIS IS WHERE YOU DEFINE THE NAME
    @Bean(name = "submissionTaskExecutor")
    public Executor submissionTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // This controls how many Docker containers run at once
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(500);

        executor.setThreadNamePrefix("SubWorker-");
        executor.initialize();
        return executor;
    }
}