package com.SubmissionService.template.templateImp;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Service;

import com.SubmissionService.template.CodeRunner;

@Service
public class CppDockerRunner implements CodeRunner {

    @Override
    public String runCodeWithInput(String code, String input) throws Exception {

        // 1. Create temporary directory for this submission
        Path tempDir = Files.createTempDirectory("cpp-submission-");

        // 2. Create Main.cpp file
        File codeFile = new File(tempDir.toFile(), "Main.cpp");
        try (FileWriter writer = new FileWriter(codeFile)) {
            writer.write(code);
        }

        // 3. Create input.txt file
        File inputFile = new File(tempDir.toFile(), "input.txt");
        try (FileWriter fw = new FileWriter(inputFile)) {
            fw.write(input);
        }

        // 4. Map temp directory to Docker container
        String tempPath = tempDir.toAbsolutePath().toString();
        String volumeMapping = String.format("%s:/workspace", tempPath);

        // 5. Command to compile and run C++ code inside Docker
        String innerCommand = "g++ Main.cpp -o Main && timeout 5s ./Main <input.txt";

        // 6. Build Docker command
        String[] commandToExecute = {
                "docker", "run",
                "--rm",
                "--network", "none",
                "-v", volumeMapping,
                "-w", "/workspace",
                "gcc:latest", // Docker image with GCC
                "sh", "-c", innerCommand
        };

        // 7. Execute Docker command
        Process process = Runtime.getRuntime().exec(commandToExecute);
        process.waitFor();

        // 8. Capture output and errors
        String output = new String(process.getInputStream().readAllBytes()).trim();
        String errors = new String(process.getErrorStream().readAllBytes()).trim();

        // 9. Clean up temp directory
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