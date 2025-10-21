package com.SubmissionService.runners;

import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Component
public class RedisShutdownHook {

    @PreDestroy
    public void stopRedisContainer() throws Exception {
        System.out.println("🧹 Stopping Redis container...");
        new ProcessBuilder("docker", "rm", "-f", "redis-codeclash")
                .inheritIO()
                .start()
                .waitFor();
        System.out.println("✅ Redis container stopped.");
    }
}
