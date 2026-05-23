# DevPulse

DevPulse is an Internal Tech Issue & Feature Tracker designed for software teams to collaborate seamlessly. It allows team members to report bugs, suggest new feature requests, and coordinate resolutions efficiently based on user roles and permissions.

## 🚀 Live Deployment
- **Live API URL:** https://b7-assingment-2.vercel.app/ 
- **GitHub Repo:**  https://github.com/akmal81/b7-assignment-2.git 
---

## 🛠️ Technology Stack

- **Runtime:** Node.js (LTS v24.x or higher)
- **Language:** TypeScript (Strictly typed, no `any`)
- **Framework:** Express.js (Modular router architecture)
- **Database:** PostgreSQL (Hosted via NeonDB)
- **Database Driver:** Native `pg` pool driver (Raw SQL queries, Absolutely No ORM/Query Builders)
- **Security & Authentication:** `bcrypt` (Password hashing with 8-12 salt rounds) and `jsonwebtoken` (Standard JWT implementation)
- **Utility Package:** `http-status-codes` (Consistent HTTP response management)

---

## ✨ Features and Capabilities

- **Role-Based Access Control (RBAC):** Distinct permissions for `contributor` and `maintainer` with fine-grained endpoint security.
- **Strict Data Validation:** Robust database and server-level check logic (e.g., issue descriptions must be at least 20 characters and titles maximum 150 characters).
- **Asynchronous & Non-Blocking Architecture:** Optimized to handle high-concurrency requests safely via PostgreSQL connection pooling.
- **Centralized Error Handling:** Global error handler middleware to gracefully catch and return structural errors for both synchronous and asynchronous failures.

---

## 🗄️ Database Schema Summary

The relational database architecture consists of two primary tables using native constraints:

### 1. `users` Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
```sql
### 2. `issues` Table
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
    type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    reporter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#🌐 API Endpoints Specification

🔹 Authentication Module
POST /api/auth/signup (Public) - Registers a new account as a contributor or maintainer.

POST /api/auth/login (Public) - Authenticates credentials and issues a signed JWT containing payload tokens (id, name, role).

🔹 Issues Module
POST /api/issues (Private) - Allows authenticated contributors and maintainers to create tracking entries (reporter_id extracted from JWT).

GET /api/issues (Public) - Retrieves all issues with support for sort (newest/oldest), type, and status query parameters.

GET /api/issues/:id (Public) - Retrieves full individual issue profiles embedded with reporter details.

PATCH /api/issues/:id (Private) - Allows maintainers, or the original contributor (only if status is open), to modify titles, descriptions, or types.

DELETE /api/issues/:id (Private) - Permanently removes items from the database (Restricted to Maintainers only).


# 🛠️ Local Setup and Installation Steps

Follow these steps to run the DevPulse server locally on your machine:

1. Clone the Repository

git clone https://github.com/akmal81/b7-assignment-2.git

```
cd b7-assignment-2
```


2. Install Project Dependencies
```
npm install
```



3. Setup Environment Variables
Create a .env file in the root directory and append the following configurations:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/devpulse_db
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```


4. Build and Run the Application

##### Run in Development mode
```npm run dev```

##### Build the TypeScript codebase
```npm run build```

##### Start the compiled Production code
```npm run start```