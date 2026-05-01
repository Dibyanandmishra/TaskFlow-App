# TaskFlow App

Production-grade REST API with **JWT Authentication** and **Role-Based Access Control (RBAC)**.

Built using **Node.js**, **Express 5**, and **MongoDB**, following clean architecture and scalable backend design principles.

---

## 🚀 Demo / Preview

🌐 **Live Website:** https://taskflow-app-main.onrender.com
 

---

## 📌 Overview

TaskFlow API is a secure and scalable backend system designed to manage tasks with proper authentication and authorization.

It demonstrates:
- Clean modular backend architecture
- Secure authentication & authorization
- Real-world API design practices
- Scalability-ready system design

---

---

## 🚀 Assignment Completion Checklist

This project fulfills all requirements for the **Backend Developer (Intern)** assignment at **Primetrade.ai**:

### ✅ Backend (Primary Focus)
- [x] **Auth:** Registration & Login with `bcrypt` hashing and JWT (Access + Refresh tokens).
- [x] **RBAC:** Role-based access control (`user` vs `admin`) with authorization middleware.
- [x] **CRUD:** Full task management (Create, Read, Update, Delete).
- [x] **Standards:** API Versioning (`/v1`), structured error handling, and `Joi` validation.
- [x] **Docs:** Integrated Swagger UI documentation.
- [x] **Database:** Modular MongoDB schema design with Mongoose.

### ✅ Frontend (Supportive UI)
- [x] **Tech:** React.js (Vite) with Tailwind CSS.
- [x] **Auth UI:** Functional Login/Register pages.
- [x] **Dashboard:** Protected route dashboard with real-time API connection.
- [x] **Interactions:** Perform CRUD on tasks and view live statistics.
- [x] **UX:** Show/Hide password toggles, loading states, and error alerts.

### ✅ Security & Scalability
- [x] **Token Security:** Dual token system (Access/Refresh) with Axios interceptors.
- [x] **Sanitization:** Protection against NoSQL Injection and XSS (Helmet, Sanitizer).
- [x] **Structure:** Modular architecture ready for microservices migration.
- [x] **Docker:** Containerized setup for seamless deployment.

---

## 📈 Scalability & Future Architecture Note

To ensure TaskFlow can handle millions of users and high concurrent loads, the following architectural improvements are planned:

### 1. Horizontal Scaling & Microservices
Currently, the app follows a **Modular Monolith** structure. This is designed to be easily split into microservices:
- **Auth Service:** Dedicated to token management and identity.
- **Task Service:** Dedicated to task logic and data.
- **User Service:** Managing profile and administrative metadata.

### 2. Performance Optimization (Caching)
- **Redis Integration:** Implement caching for frequently accessed data like `Task Statistics` and `User Profiles` to reduce database load.
- **Read Replicas:** Use MongoDB read replicas to distribute heavy query loads.

### 3. High Availability & Load Balancing
- **Nginx/HAProxy:** Use a reverse proxy to distribute traffic across multiple Node.js instances.
- **Stateless Auth:** Since JWT is used, the backend is naturally stateless, allowing it to scale horizontally without session synchronization issues.

### 4. Real-time Features
- **WebSockets:** Implement `Socket.io` for real-time task updates across multiple users in the same project/organization.

---


## Architecture

```bash
backend/
├── server.js                    # Entry point — DB connect, server start
├── Dockerfile                   # Production container
├── docker-compose.yml           # Multi-container setup
├── .env.example                 # Env template
└── src/
    ├── app.js                   # Express app setup
    ├── config/
    │   ├── index.js             # Env + config
    │   └── db.js                # MongoDB connection
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── notFound.js
    │   ├── rateLimiter.js
    │   ├── sanitize.js
    │   └── validate.js
    ├── modules/
    │   ├── auth/
    │   ├── task/
    │   └── user/
    ├── utils/
    │   ├── AppError.js
    │   ├── apiResponse.js
    │   ├── catchAsync.js
    │   ├── generateToken.js
    │   ├── logger.js
    │   └── paginate.js
    ├── docs/
    │   └── swagger.js
    └── scripts/
        └── seed.js

---
```

---

## Tech Stack

| Category       | Technology |
|----------------|-----------|
| Runtime       | Node.js |
| Framework     | Express 5 |
| Database      | MongoDB + Mongoose |
| Auth          | JWT + bcrypt |
| Validation    | Joi |
| Docs          | Swagger (OpenAPI) |
| Deployment    | Docker |

---

## Environment Variables Setup(./env)

```bash
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=1d
```

## ⚡ Quick Start

### 📋 Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

---


## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Setup

```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

### Swagger Documentation

Visit `http://localhost:5000/api-docs` for interactive API documentation.

---

## API Endpoints

### Authentication
| Method | Endpoint                    | Access  | Description          |
|--------|-----------------------------|---------|----------------------|
| POST   | `/api/v1/auth/register`     | Public  | Register new user    |
| POST   | `/api/v1/auth/login`        | Public  | Login                |
| POST   | `/api/v1/auth/refresh-token`| Public  | Refresh access token |
| GET    | `/api/v1/auth/me`           | Private | Get current profile  |

### Tasks
| Method | Endpoint                | Access  | Description              |
|--------|-------------------------|---------|--------------------------|
| GET    | `/api/v1/tasks`         | Private | List tasks (filtered)    |
| POST   | `/api/v1/tasks`         | Private | Create task              |
| GET    | `/api/v1/tasks/stats`   | Private | Get task statistics      |
| GET    | `/api/v1/tasks/:id`     | Private | Get task by ID           |
| PATCH  | `/api/v1/tasks/:id`     | Private | Update task              |
| DELETE | `/api/v1/tasks/:id`     | Private | Delete task              |

### Users (Admin Only)
| Method | Endpoint                     | Access | Description           |
|--------|------------------------------|--------|-----------------------|
| GET    | `/api/v1/users`              | Admin  | List all users        |
| GET    | `/api/v1/users/:id`          | Admin  | Get user by ID        |
| PATCH  | `/api/v1/users/:id/role`     | Admin  | Update user role      |
| PATCH  | `/api/v1/users/:id/status`   | Admin  | Toggle active status  |

### System
| Method | Endpoint   | Access | Description   |
|--------|------------|--------|---------------|
| GET    | `/health`  | Public | Health check  |

---

## Response Format

All responses follow a consistent envelope:

```json
// Success
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalDocs": 50,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

---

## Query Parameters (Tasks)

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `page`     | number | Page number (default: 1)             |
| `limit`    | number | Items per page (default: 20, max: 100)|
| `status`   | string | `pending`, `in_progress`, `completed`|
| `priority` | string | `low`, `medium`, `high`              |
| `search`   | string | Full-text search on title/description|
| `sortBy`   | string | Sort field (default: `createdAt`)    |
| `sortOrder`| string | `asc` or `desc` (default: `desc`)    |

---

## Security

- **Helmet** — HTTP security headers
- **bcrypt** — Password hashing (12 rounds)
- **JWT** — Stateless authentication with access/refresh token pairs
- **express-mongo-sanitize** — NoSQL injection prevention
- **hpp** — HTTP parameter pollution protection
- **Rate limiting** — Global (100/15min) + Auth-specific (20/15min)
- **Input validation** — Joi schemas on all endpoints with `stripUnknown`
- **RBAC** — Role-based middleware with ownership enforcement

---

## Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api
```

---

## Seed Credentials

After running `npm run seed`:

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@taskflow.com | Admin@123  |
| User  | john@taskflow.com  | User@123   |

---

## 👨‍💻 Author

**Dibyanand Mishra**

## 🌐 Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-Dibyanandmishra-181717?style=for-the-badge&logo=github)](https://github.com/Dibyanandmishra)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Dibyanand%20Mishra-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/dibya-nand-mishra-84865a301/)

## License

Not Available