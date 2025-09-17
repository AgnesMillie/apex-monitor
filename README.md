# Apex Monitor

> A robust API health monitoring service built with a microservices architecture to showcase backend and DevOps skills.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📖 About The Project

Apex Monitor is a backend-focused portfolio project designed to demonstrate a scalable and maintainable software architecture. It simulates a real-world monitoring service where different parts of the application (API, background workers) are decoupled and containerized.

This project showcases key skills in:
* **Microservices Architecture:** Decoupling the main user-facing API from the background checking service to ensure separation of concerns and scalability.
* **Backend Development:** Building a secure REST API with user authentication (JWT) and full CRUD functionalities using Node.js and TypeScript.
* **DevOps & Infrastructure:** Orchestrating a multi-container environment using Docker and Docker Compose, including health checks for robust service dependency management.
* **Database Management:** Designing a relational database schema with foreign keys to ensure data integrity.

### Built With
* **Backend:** [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/) & [Express.js](https://expressjs.com/)
* **Database:** [MySQL](https://www.mysql.com/)
* **Infrastructure:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🏛️ Architecture Overview

The system is designed with a clear separation of concerns, orchestrated entirely by Docker Compose.

* **`api-server`**: The core REST API. It handles user registration, login (JWT generation), and CRUD operations for the endpoints to be monitored.
* **`checker-worker`**: A separate background service. It periodically fetches all endpoints from the database and performs HTTP requests to check their status.
* **`db`**: A MySQL database instance that persists all user and endpoint data.

![Architecture Diagram](https://github.com/user-attachments/assets/9ac5b437-e1a9-4e19-a2f1-07a053a28951)

---

## 🚀 Getting Started

To get a local copy of the backend services up and running, follow these steps.

### Prerequisites
* Docker & Docker Compose

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/AgnesMillie/apex-monitor.git](https://github.com/AgnesMillie/apex-monitor.git)
    cd apex-monitor
    ```

2.  **Set up environment variables**
    * Create a `.env` file in the root directory by copying the example:
        ```sh
        # For Windows (Command Prompt)
        copy .env.example .env

        # For Windows (PowerShell)
        cp .env.example .env

        # For Linux/macOS
        cp .env.example .env
        ```
    * Fill in the required variables in your new `.env` file.

3.  **Build and run with Docker**
    ```sh
    docker-compose up --build -d
    ```
    The API will be available at `http://localhost:3001`.

---

## 📜 API Reference

All endpoints (except `/register` and `/login`) are protected and require a `Bearer Token` in the `Authorization` header.

| Route | Method | Protected | Description |
| -------------------- | ------ | --------- | --------------------------------------------------- |
| `/api/auth/register` | `POST` | No | Registers a new user. |
| `/api/auth/login` | `POST` | No | Authenticates a user and returns a JWT. |
| | | | |
| `/api/endpoints` | `GET` | **Yes** | Lists all endpoints for the authenticated user. |
| `/api/endpoints` | `POST` | **Yes** | Adds a new endpoint to monitor. |
| `/api/endpoints/:id` | `PUT` | **Yes** | Updates an existing endpoint. |
| `/api/endpoints/:id` | `DELETE`| **Yes** | Deletes an endpoint. |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.