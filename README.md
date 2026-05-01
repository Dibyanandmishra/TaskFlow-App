# TaskFlow API

Production-grade REST API with JWT Authentication and Role-Based Access Control (RBAC).

Built with **Node.js**, **Express 5**, **MongoDB/Mongoose**, and designed following clean architecture principles.

---

## Architecture

```
backend/
├── server.js                    # Entry point — DB connect, graceful shutdown
├── Dockerfile                   # Multi-stage production image
├── docker-compose.yml           # API + MongoDB orchestration
├── .env.example                 # Environment variable template
└── src/
    ├── app.js                   # Express app — middleware, routes, error handling
    ├── config/
    │   ├── index.js             # Centralized config with env validation
    │   └── db.js                # MongoDB connection with retry logic
    ├── middleware/
    │   ├── auth.js              # JWT authentication + role authorization
    │   ├── errorHandler.js      # Centralized error handling
    │   ├── notFound.js          # 404 catch-all
    │   ├── rateLimiter.js       # Global + auth-specific rate limiting
    │   └── validate.js          # Joi validation middleware factory
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.js
    │   │   ├── auth.routes.js
    │   │   ├── auth.service.js
    │   │   └── auth.validation.js
    │   ├── task/
    │   │   ├── task.controller.js
    │   │   ├── task.model.js
    │   │   ├── task.routes.js
    │   │   ├── task.service.js
    │   │   └── task.validation.js
    │   └── user/
    │       ├── user.controller.js
    │       ├── user.model.js
    │       ├── user.routes.js
    │       ├── user.service.js
    │       └── user.validation.js
    ├── utils/
    │   ├── AppError.js          # Operational error class
    │   ├── apiResponse.js       # Standardized response helpers
    │   ├── catchAsync.js        # Async error wrapper
    │   ├── generateToken.js     # JWT access + refresh token generation
    │   ├── logger.js            # Structured logger
    │   └── paginate.js          # Pagination utility
    ├── docs/
    │   └── swagger.js           # OpenAPI 3.0 specification
    └── scripts/
        └── seed.js              # Database seeding script
```

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

## License

ISC