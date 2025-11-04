## Want to compete with me in coding? Come to CodeClash!
### Happy to Introduce about CodeClash :)

# CodeClash: A Room Based Coding Contest Platform

CodeClash is a full-stack, microservices-based application designed for hosting real-time, room-based coding contests. It allows users to create a room, invite friends via a room code, and compete to solve Data Structures and Algorithms (DSA) problems in a live environment.

The platform features a real-time lobby, a code editor, live submission results, and a dynamic leaderboard, all powered by a distributed backend system.

## ✨ Features

  * **Room-Based Contests:** Create a unique room for a private contest and invite others with a room code.
  * **Real-Time Lobby:** See players join the lobby in real-time using Spring WebSockets and STOMP.
  * **Dynamic Question Selection:** The host can configure the contest by selecting the number of easy, medium, and hard questions.
  * **In-Browser Code Editor:** A rich code editor (powered by Monaco) with syntax highlighting for Java, Python, and JavaScript.
  * **Live Submissions:** Submit code and get real-time status updates (`Queued`, `Running`, `Finished`) by polling the submission service.
  * **Real-Time Submission Feed:** See all submissions from all players in the room as they happen.
  * **Real-Time Leaderboard:** The scoreboard updates automatically every time a player makes a new, correct submission.
  * **Persistent Leaderboard:** View a final, shareable leaderboard page for a completed contest.

-----

## 🏗️ System Architecture

This project is built on a microservice architecture, with services communicating via `RestTemplate` for synchronous calls and WebSockets for real-time client-side updates.

[Image of a microservice architecture diagram]

The system is composed of five main services:

1.  **`Frontend` (React @ Port 3000):** A single-page application that provides the user interface. It connects to the `Room Service` via WebSockets for real-time updates and calls other services via REST for actions.
2.  **`Room Service` (Spring Boot @ Port 8080):** The central hub for users.
      * Manages room creation, joining, and starting.
      * Acts as the WebSocket broker, managing STOMP subscriptions.
      * Receives pre-calculated scores and live feed data from other services and broadcasts them to clients.
3.  **`Question Service` (Spring Boot @ Port 8081):**
      * Manages the database of DSA questions and test cases.
      * Provides an endpoint to fetch a random set of questions based on difficulty (`/question-all-types-random`).
4.  **`Submission Service & Scoreboard Service` (Spring Boot @ Port 8082):**
      * Receives code submissions from users (Base64 encoded).
      * Queues and runs the code (simulated or via Docker).
      * Stores the `Submission` result in its database.
      * Notifies the `Scoreboard Service` and `Room Service` upon completion.
      * Provides endpoints for submission polling and history.
      * Acts as the "gatekeeper" for scoring.
      * Maintains an internal state (in-memory or Redis) to track which players have solved which questions.
      * Receives `validate` requests from the `Submission Service` to prevent duplicate scores for the same problem.
      * If a submission is new and correct, it notifies the `Room Service` to increment that player's score.

### Data Flow Example: A Player Solves a Problem

1.  **React (Client)** `POST`s the code, `playerId`, `roomCode`, etc., to the **Submission Service (8082)**.
2.  **Submission Service** runs the code, saves the `Submission` as "FINISHED" in its database.
3.  **Submission Service** then makes two `RestTemplate` calls:
      * `POST /scoreboard/validate` to the **Scoreboard Service (8083)** with the result.
      * `POST /internal/new-submission` to the **Room Service (8080)** with the full `SubmissionDTO` for the live feed.
4.  **Room Service** receives the `SubmissionDTO` and broadcasts it over the `/topic/{roomCode}/submission-feed` WebSocket.
5.  **Scoreboard Service** checks if the solution is correct and if the player has *already* solved this problem.
6.  If it's a **new, correct** solution, the **Scoreboard Service** `POST`s an `IncrementScoreDTO` to the **Room Service (8080)** at `/internal/increment-score/{roomCode}`.
7.  **Room Service** receives the increment request, updates the `PlayerStats` in its database, and broadcasts the *entire* updated leaderboard over the `/topic/{roomCode}/leaderboard` WebSocket.
8.  **React (Client)**, which is subscribed to both topics, receives the updates and re-renders the UI instantly.

-----

## 🛠️ Tech Stack

### Backend

  * **Java 17+**
  * **Spring Boot 3**
      * Spring Web
      * Spring Data JPA
      * Spring WebSocket (with STOMP)
  * **MySQL**
  * **Lombok**
  * **Docker**
  * **Redis**
  * **`RestTemplate`** (for inter-service communication)

### Frontend

  * **React 18+**
  * **React Router**
  * **Axios** (for REST API calls)
  * **`@monaco-editor/react`** (for the code editor)
  * **`@stomp/stompjs` & `sockjs-client`** (for WebSocket communication)

-----

## 🏁 Getting Started

### Prerequisites

  * Java JDK 17 or newer
  * Maven 3.6+
  * Node.js 18+ and npm
  * A running MySQL server

### 1\. Backend Setup

You must configure and run all four backend services.

For **each** service (`room-service`, `question-service`, `submission-service`, `scoreboard-service`):

1.  **Configure Database:**
    Open `src/main/resources/application.properties` and update the database connection details for each service that requires one:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```

2.  **Run the Service:**

    ```bash
    # Navigate to the service's root folder
    cd path/to/room-service/

    # Run the application
    mvn spring-boot:run
    ```

Ensure all four services are running simultaneously on their respective ports (8080, 8081, 8082, 8083).

### 2\. Frontend Setup

1.  **Navigate to the frontend folder:**
    ```bash
    cd path/to/frontend/
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the app:**
    ```bash
    npm start
    ```

Your application should now be running at `http://localhost:3000`.

-----

## 🔑 API Endpoints

### Room Service (Port 8080)

  * `POST /room/create?hostName={name}`: Creates a new room.
  * `POST /room/join?roomCode={code}&playerName={name}`: Joins an existing room.
  * `POST /room/start?roomCode={code}`: Starts the game (sends settings in body).
  * `POST /internal/new-submission`: **[Internal]** Receives live feed update from Submission Service.
  * `GET /ws`: WebSocket connection endpoint.

### Question Service (Port 8081)

  * `POST /questions`: Adds a new question to the database.
  * `POST /questions/question-all-types-random`: Fetches a set of questions based on difficulty (e.g., `{ "easy": 5, "medium": 2,"hard":3 }`).
  * `DELETE /questions/{questionNumber}`: Deletes a question and its test cases.

### Submission & Judgement Service (Port 8082)  

  * `POST /submissions`: Submits code for execution.
  * `GET /submissions/{id}`: Polls for the status/result of a single submission.
  * `GET /submissions/all/{roomCode}`: Gets the submission history for a room.
  * `GET /submissions/leaderboard/{roomCode}`: Gets the final, static leaderboard data.

### Scoreboard Service (Port 8083)

  * `POST /scoreboard/validate`: **[Internal]** Receives submission result from Submission Service to validate and check for duplicates.

-----

## 🔮Keep an eye for Future Improvements

  * **Service Discovery:** Integrate Eureka or Consul for service registration and discovery.
  * **API Gateway:** Add a Spring Cloud Gateway to act as a single entry point for the frontend.
  * **Async Communication:** Replace `RestTemplate` calls with a message broker like RabbitMQ or Kafka for a more resilient, asynchronous architecture.
  * **Secure Code Execution:** Use `Docker` in the Submission Service to safely execute untrusted code.
  * **Authentication:** Add user login/registration using Spring Security and JWT.
