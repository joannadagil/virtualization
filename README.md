# docker_project

Minimalistic project for the Virtualisation and Containerization course - multi-container application with Docker Compose.

The project consists of three services:
- MySQL database
- Node.js backend API
- Nginx frontend

## Architecture

Database (MySQL)  
Stores application data. Uses a Docker volume for persistent storage. Exposes a healthcheck to signal service availability.

Backend (Node.js + Express)  
Connects to the MySQL database. Depends on a healthcheck for a database and additional check in code (waitForDb).

Frontend (Nginx)  
Serves static HTML content. Depends on backend.

## Configuration

Sensitive information, ports and image versions are stored in a .env file and injected into containers using Docker Compose environment variables.

## Networking

All services run on the default Docker Compose bridge network.

## Volumes

db_data - persistent storage for MySQL data.

## Running the project

### .env file

```bash
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_pass

DB_HOST=db
DB_PORT=3306
```

### .gitignore file

```bash
.env
node_modules
db_data
```

### Commands

```bash
wsl.exe -d Ubuntu 
docker compose up --build

docker compose down
docker compose down -v
```
### Results

Page available at http://localhost:8080

Backend check at http://localhost:3000
