
# Dynamic Cron Management System

A robust, distributed system for managing and executing dynamic cron jobs. Built with Node.js, Express, MongoDB, and Redis/BullMQ. It allows you to create, update, delete, and monitor cron jobs via a REST API, with execution logs and failover capabilities.

## 🚀 Features

*   **Dynamic Cron Scheduling**: Create and modify cron schedules on the fly without restarting the server.
*   **Distributed Execution**: Uses Redis and BullMQ to handle job distribution and prevent duplicate executions in a multi-instance environment.
*   **Distributed Locking**: Ensures that a scheduled job runs only once across multiple server instances.
*   **Execution Logging**: Tracks every job execution, including success `status`, `response status`, `response body`, and `errors`.
*   **Webhook Integration**: Executes a specified webhook URL for each job.
*   **Request Validation**: Uses `Joi` to validate API requests.
*   **Docker Ready**: Includes `Dockerfile` and `docker-compose.yml` for easy deployment.

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Persists jobs and logs)
*   **Queue/Caching**: Redis & BullMQ
*   **Scheduling**: node-cron (for local ticks)
*   **Validation**: Joi

## 📂 Project Structure

```
├── advance-cron/       # Bruno/Postman collection for testing API endpoints
├── configs/            # Configuration files
│   ├── cron.js         # Core logic for scheduling and syncing jobs with Redis
│   ├── db.js           # database connection
│   ├── env.js          # Environment variables mapping
│   ├── queue.js        # BullMQ Queue and Worker setup (Singleton pattern)
│   └── redis.js        # Redis client configuration
├── controllers/        # Request handlers
│   ├── cronJobController.js      # CRUD for Cron Jobs (syncs with Redis)
│   └── executionLogController.js # CRUD for Execution Logs
├── middleware/         # Express middleware (e.g., Joi validation)
├── models/             # Mongoose schemas (CronJob, ExecutionLog)
├── routes/             # API Route definitions
├── validators/         # Joi validation schemas
├── workers/            # Background workers (process jobs from the queue)
├── index.js            # Entry point
├── Dockerfile          # Docker image build instructions
└── docker-compose.yml  # Local stack (App, Mongo, Redis)
```

## 🔄 How It Works

1.  **Creation**: A user creates a CronJob via the API (`POST /api/cron`).
2.  **Scheduling**: The system saves the job to MongoDB and registers it in:
    *   **Redis** (as a source of truth for active jobs).
    *   **Local Memory** (via `node-cron` schedule).
3.  **Triggering**: When `node-cron` triggers the schedule:
    *   It checks Redis to ensure the job is still active.
    *   It attempts to acquire a **Distributed Lock** in Redis.
    *   If successful, it adds a job to the **BullMQ Queue**.
4.  **Execution**: The **Worker** (`workers/cronWorker.js`) picks up the job from the queue.
    *   It sends a `POST` request to the configured `webhookUrl`.
    *   It records the result (Success/Failure) in the `ExecutionLogs` collection.

## 🏁 Getting Started

### Prerequisites

*   Docker & Docker Compose (Recommended)
*   OR Node.js v18+, Redis, and MongoDB running locally.

### Running with Docker (Easiest)

1.  Clone the repository.
2.  Run the stack:
    ```bash
    docker-compose up --build
    ```
    This starts the Node.js API, MongoDB, and Redis.

### Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set up environment variables (create a `.env` file or update `configs/env.js` defaults if needed):
    ```env
    DB_HOST=localhost
    REDIS_HOST=localhost
    APP_PORT=3000
    ```
3.  Start the server:
    ```bash
    npm start
    ```

## 🔌 API Endpoints

### Cron Jobs
*   `POST /api/cron` - Create a new cron job.
*   `GET /api/cron` - List all cron jobs.
*   `PUT /api/cron/:id` - Update a cron job.
*   `DELETE /api/cron/:id` - Delete a cron job.

### Execution Logs
*   `GET /api/execution-logs` - Get all logs.
*   `GET /api/execution-logs/job/:cronJobId` - Get logs for a specific job.

## 🧪 Testing
Use the Bruno collection provided in the `advance-cron` folder to import and test all endpoints easily.
