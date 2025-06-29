# Hotel Booking Platform

<p align="start">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" height="70" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original-wordmark.svg" height="70" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" height="70" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" height="70" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-original-wordmark.svg" height="70" />
</p>

<br>

A modern web application for hotel room reservations, demonstrating containerized deployment with Docker and Kubernetes.

---

## Key Features

- User registration and login (JWT)
- Room browsing with filtering
- Reservation management
- Admin panel for managing rooms
- Fully containerized using Docker
- Kubernetes manifests provided for production deployment

---

## Technical Architecture

| Component        | Technology               |
|-------------------|-------------------------|
| Frontend          | React (served via NGINX) |
| Backend           | Spring Boot REST API    |
| Database          | MySQL                   |
| Containerization  | Docker + Kubernetes     |
| Authentication    | JWT                     |

---

## Quick Start (Local Development)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Clone the Repository

```bash
git clone https://github.com/anastefanovska/hotel-booking-platform.git
cd hotel-booking-platform
````

---

### Environment Variables

You **must** create a `.env` file in the **root directory** **before** using Docker Compose.

Example `.env` file:

```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=hotel_db
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
```

> ⚠️ Without this `.env` file, the backend container will not start correctly because it relies on these environment variables.

---

### Run with Docker Compose

From the project root:

```bash
docker-compose up --build
```

This command will:

* Build and start **frontend**, **backend**, and **MySQL** services
* Network them automatically for local development

---

### Access the App Locally

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend**: [http://localhost:8080](http://localhost:8080) + endpoint paths (e.g. `/auth`, `/reservations`, etc.)

> The React frontend is served via NGINX at port 3000.
> The Spring Boot backend REST API is available at port 8080 and exposes its controllers on specific paths.

---

### Kubernetes Components

* Frontend Deployment and Service
* Backend Deployment and Service
* MySQL StatefulSet
* NGINX Ingress Controller

> Kubernetes manifests are provided in the `kubernetes/` directory for production-ready orchestration.

---

## Access Points

| Environment | URL                                            | Description                                                                              |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Local       | [http://localhost:3000](http://localhost:3000) | React Frontend                                                                           |
|             | [http://localhost:8080](http://localhost:8080) | Spring Boot Backend base URL; append path for controller (e.g. `/auth`, `/reservations`) |
| Kubernetes  | Configurable via Ingress                       | Routes to frontend and backend services; backend endpoints served on controller paths    |

---

## CI/CD Workflow

This project includes a GitHub Actions workflow that automates building and pushing Docker images to Docker Hub.

* **Trigger:** On every push to the `main` branch affecting important paths.
* **Steps:**

  1. Checks out the latest code
  2. Logs in to Docker Hub using secrets
  3. Builds the **frontend** and **backend** Docker images from source
  4. Pushes the new images to Docker Hub repositories

This ensures Docker Hub always has the latest production-ready images when code changes.

Example workflow trigger:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - 'frontend/**'
      - 'docker-compose.yml'
      - '.github/workflows/**'
```

> The full workflow definition is located in `.github/workflows/` in the repository.

---

## Project Structure

```bash
hotel-booking-platform/
├── frontend/                # React application
│   ├── public/        
│   └── src/ 
├── backend/                 # Spring Boot application
│   ├── src/main/java/ 
│   └── src/main/resources   # Config files
├── kubernetes/              # Kubernetes manifests
│   ├── deployments/ 
│   └── services/ 
├── .github/
│   └── workflows/           # CI/CD workflow definitions
├── docker-compose.yml       # Local development setup
└── .env                     # REQUIRED for Docker Compose
```

---

## Resources

### Docker Images

* **Frontend**: [anastefanovska/hotel-booking-platform-frontend](https://hub.docker.com/repository/docker/anastefanovska/hotel-booking-platform-frontend/general)
* **Backend**: [anastefanovska/hotel-booking-platform-backend](https://hub.docker.com/repository/docker/anastefanovska/hotel-booking-platform-backend/general)
* **MySQL**: `mysql:8.0`

---
