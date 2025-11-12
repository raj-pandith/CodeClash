package com.SubmissionService.service;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Service;

@Service
public class DockerRunner {

    public String runJavaCodeWithInput(String code, String input) throws Exception {

        Path tempDir = Files.createTempDirectory("submission-");
        File codeFile = new File(tempDir.toFile(), "Main.java");

        try (FileWriter writer = new FileWriter(codeFile)) {
            writer.write(code);
        }

        File inputFile = new File(tempDir.toFile(), "input.txt");
        try (FileWriter fw = new FileWriter(inputFile)) {
            fw.write(input);
        }

        // String dockerCommand = String.format(
        // "docker run --rm --network none -v %s:/workspace -w /workspace
        // openjdk:17-slim bash -c "
        // +
        // "\"javac Main.java && timeout 5s java Main < input.txt\"",
        // tempDir.toAbsolutePath());

        // Get the absolute path for the volume mapping.
        String tempPath = tempDir.toAbsolutePath().toString();

        // Docker is smart enough to handle this Windows path, even in WSL.
        String volumeMapping = String.format("%s:/workspace", tempPath);

        // This is the command that will run *inside* the container.
        String innerCommand = "javac Main.java && timeout 5s java Main < input.txt";

        // Build the command as an array of arguments.
        String[] commandToExecute = {
                "docker", "run",
                "--rm",
                "--network", "none",
                "-v", volumeMapping,
                "-w", "/workspace",
                "openjdk:17-jdk", // Use the full JDK image
                "sh", "-c", innerCommand // Tell the container's shell to execute our command
        };

        // Execute the command array. This is much more reliable.
        Process process = Runtime.getRuntime().exec(commandToExecute);

        process.waitFor(); // The rest of your code remains the same...

        String output = new String(process.getInputStream().readAllBytes()).trim();
        String errors = new String(process.getErrorStream().readAllBytes()).trim();

        deleteDirectory(tempDir.toFile());

        if (!errors.isEmpty())
            return "compile_error:\n" + errors;
        return output;
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null)
            for (File f : files)
                deleteDirectory(f);
        dir.delete();
    }
}
