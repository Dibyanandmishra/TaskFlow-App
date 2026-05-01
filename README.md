# this is temp readme --- i will replace it later 
 
---

# 🗂️ TaskFlow App
### A Secure Task Management REST API with Role-Based Access Control

TaskFlow is a scalable backend-driven task management system that allows users to create, manage, and track tasks securely. It includes authentication, role-based access control (RBAC), and a minimal frontend interface.

---

## 🎯 Objective

Build a secure, scalable REST API system that allows users to manage tasks with authentication and role-based access control, along with a minimal frontend.

---

## 👥 Target Users

### 👤 Normal Users
- Manage their own tasks

### 🛠️ Admins
- Monitor and manage all users’ tasks

---

## ✨ Features

### 🔐 Authentication System
- User Registration  
- User Login  
- Password hashing using bcrypt  
- JWT-based authentication  

---

### 🛡️ Role-Based Access Control (RBAC)

#### Roles:
- `user`
- `admin`

#### Permissions:
- **User** → Access only their own tasks  
- **Admin** → Access all tasks  

---

### 📝 Task Management (CRUD)

Each task contains:
- `title`
- `description`
- `status` (pending / completed)
- `createdBy` (user reference)

#### APIs:
- Create Task  
- Get Tasks  
- Update Task  
- Delete Task  

---

### 🌐 API Design
- RESTful endpoints  
- Versioning (`/api/v1`)  
- Proper HTTP status codes  
- Centralized error handling  

---

### 🔒 Security
- Password hashing (bcrypt)  
- JWT authentication  
- Protected routes  
- Input validation & sanitization  

---

### 💻 Frontend (Minimal)
- Register / Login UI  
- Dashboard  
- Task CRUD UI  
- JWT API integration  

---

### 📚 Documentation
- Postman Collection OR Swagger  

---

### 🚀 Scalability
- Modular architecture  
- Microservices-ready  
- Redis caching (optional)  
- Containerization support  

---

## 🛠️ Tech Stack

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Mongoose)  

### Auth & Security
- JWT  
- bcrypt  

---

## 🧠 System Architecture

TaskFlow follows a **client-server architecture**:

- **Frontend** → UI & API calls  
- **Backend** → Business logic & APIs  
- **Database** → Stores users and tasks  

---

## 📁 Project Structure

```bash
backend/
 ├── src/
 │   ├── config/
 │   │    └── db.js
 │   │
 │   ├── modules/
 │   │    ├── auth/
 │   │    │    ├── auth.controller.js
 │   │    │    ├── auth.service.js
 │   │    │    ├── auth.routes.js
 │   │    │
 │   │    ├── user/
 │   │    │    ├── user.model.js
 │   │    │
 │   │    ├── task/
 │   │    │    ├── task.controller.js
 │   │    │    ├── task.service.js
 │   │    │    ├── task.model.js
 │   │    │    ├── task.routes.js
 │   │
 │   ├── middleware/
 │   │    ├── auth.middleware.js
 │   │    ├── role.middleware.js
 │   │    ├── error.middleware.js
 │   │
 │   ├── utils/
 │   │    ├── generateToken.js
 │   │
 │   ├── app.js
 │
 ├── server.js
 ├── .env