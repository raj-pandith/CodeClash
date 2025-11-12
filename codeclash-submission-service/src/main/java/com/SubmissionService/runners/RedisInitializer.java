package com.SubmissionService.runners;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;

@Component
public class RedisInitializer {

    @PostConstruct
    public void initRedis() throws Exception {
        // 1️⃣ Check if Redis container is already running
        ProcessBuilder check = new ProcessBuilder(
                "docker", "ps", "--filter", "name=redis-codeclash", "--format", "{{.Names}}");
        Process checkProcess = check.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(checkProcess.getInputStream()));
        String containerName = reader.readLine();

        if (containerName == null || containerName.isEmpty()) {
            System.out.println("🚀 Starting Redis container...");
            new ProcessBuilder("docker", "run", "-d", "--name", "redis-codeclash", "-p", "6379:6379", "redis")
                    .inheritIO()
                    .start();
        } else {
            System.out.println("✅ Redis container already running: " + containerName);
        }

        // 2️⃣ Wait until Redis is up
        boolean isRedisUp = false;
        for (int i = 0; i < 10; i++) {
            try (Socket socket = new Socket("localhost", 6379)) {
                isRedisUp = true;
                System.out.println("✅ Redis is ready!");
                break;
            } catch (Exception e) {
                System.out.println("⏳ Waiting for Redis to start...");
                Thread.sleep(1000);
            }
        }

        if (!isRedisUp) {
            System.err.println("❌ Redis did not start in time!");
        }
    }
}
