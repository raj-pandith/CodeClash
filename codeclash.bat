@echo off
title CodeClash Service Controller
cls

echo ========================================
echo   1. Start all services
echo   2. Stop all services
echo ========================================
set /p choice=Enter your choice (1 or 2): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
goto end

:start
echo.
echo ===== Starting All Services =====

cd /d "%~dp0Question-Service-App"
start "QuestionService" cmd /k "title QuestionService && mvn spring-boot:run"
cd ..

cd /d "%~dp0codeclash-RoomService"
start "RoomService" cmd /k "title RoomService && mvn spring-boot:run"
cd ..

cd /d "%~dp0codeclash-submission-service"
start "SubmissionService" cmd /k "title SubmissionService && mvn spring-boot:run"
cd ..

cd /d "%~dp0codeclash-frontend"
start "Frontend" cmd /k "title Frontend && npm start"
cd ..

@echo off
echo Starting Docker Desktop...
start "" "C:\ProgramData\Microsoft\Windows\Start Menu"
echo Waiting for Docker to start...

:waitLoop
docker info >nul 2>&1
if errorlevel 1 (
    timeout /t 5 >nul
    goto waitLoop
)
echo Docker Engine is now running!

echo.
echo ✅ All services have been started.
pause
goto end

:stop
echo ===== Stopping All Services =====

:: kill by ports
for %%p in (8081 8082 3000 8080) do (
    echo Stopping service on port %%p ...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do taskkill /PID %%a /F >nul 2>&1
)

@echo off
echo Stopping Docker Desktop...

:: Close Docker Desktop gracefully
taskkill /IM "Docker Desktop.exe" /F >nul 2>&1

:: Stop background Docker processes (optional)
taskkill /IM "com.docker.backend.exe" /F >nul 2>&1
taskkill /IM "com.docker.service" /F >nul 2>&1

echo Docker Desktop has been stopped.
pause


echo 🛑 All services stopped.
pause
goto end

:end
exit
