# Bidly - Auction System

Bidly is a full-stack auction platform where users can register, log in, and participate in auctions. This repository contains both the backend (Spring Boot) and frontend (React + Vite).

## 🚀 Project Setup Instructions

### 1️⃣ Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21+** (for Spring Boot backend)
- **Maven** (for managing backend dependencies)
- **PostgreSQL** (as the database)
- **Node.js & npm** (for the frontend)
- **Git** (for version control)

---

### 2️⃣ Database Setup

1. Start **PostgreSQL** and ensure it's running.
2. Set up your **PostgreSQL username and password at /backend/src/main/resources/application.properties**:
   - The default username is **`postgres`**.
   - Ensure you have a database created by the name of **AuctionDB** for the project.

---

### 3️⃣ Backend Setup (Spring Boot)

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```
   This will start the backend server on port 8080.

---

### 4️⃣ Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend folder:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the frontend:

   ```sh
   npm run dev
   ```

   This will launch the frontend on Vite’s default port (5173).

---

### 5️⃣ Running the Application

1. Open a new term

- **Backend:+** Runs on http://localhost:8080
- **Frontend:+** Runs on http://localhost:5173
- Ensure **CORS is properly configured** in the backend so the frontend can communicate with the API.
