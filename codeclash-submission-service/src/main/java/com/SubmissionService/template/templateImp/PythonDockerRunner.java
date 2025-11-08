package com.SubmissionService.template.templateImp;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Service;

import com.SubmissionService.template.CodeRunner;

@Service
public class PythonDockerRunner implements CodeRunner {

    @Override
    public String runCodeWithInput(String code, String input) throws Exception {
        Path tempDir = Files.createTempDirectory("python-submission-");
        File codeFile = new File(tempDir.toFile(), "Main.py");
        Files.writeString(codeFile.toPath(), code);

        File inputFile = new File(tempDir.toFile(), "input.txt");
        Files.writeString(inputFile.toPath(), input);

        String tempPath = tempDir.toAbsolutePath().toString();
        String volumeMapping = String.format("%s:/workspace", tempPath);

        String innerCommand = "timeout 5s python3 Main.py < input.txt";

        String[] commandToExecute = {
                "docker", "run", "--rm", "--network", "none",
                "-v", volumeMapping, "-w", "/workspace",
                "python:3.11-slim",
                "sh", "-c", innerCommand
        };

        Process process = Runtime.getRuntime().exec(commandToExecute);
        process.waitFor();

        String output = new String(process.getInputStream().readAllBytes()).trim();
        String errors = new String(process.getErrorStream().readAllBytes()).trim();

        deleteDirectory(tempDir.toFile());

        if (!errors.isEmpty())
            return "runtime_error:\n" + errors;
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
