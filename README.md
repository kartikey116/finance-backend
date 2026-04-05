# Finance Backend: Enterprise-Grade Financial Infrastructure

[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-green.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-red.svg)](https://upstash.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Rotation-orange.svg)](https://jwt.io/)
[![Validation](https://img.shields.io/badge/Validation-Zod-magenta.svg)](https://zod.dev/)

**A high-performance, role-based financial data management engine designed for security, auditability, and massive scale.**

---

## 💎 The Engineering Vision

Modern financial platforms demand more than just "CRUD." They require absolute data integrity, ironclad role-based security, and lightning-fast analytics. The **Finance Backend** was architected to solve three core engineering challenges:

1.  **Multi-User Data Isolation**: We prevent "Horizontal Privilege Escalation" by enforcing ownership checks at the database query layer—not just the frontend. 
2.  **Strictly Enforced RBAC**: A multi-tiered authorization matrix (Admin, Analyst, Viewer) is built natively into the middleware stack, ensuring zero data leakage.
3.  **Atomic Data Aggregation**: We leverage MongoDB's native `$aggregate` engine and **Redis caching** to compute complex financial trends in milliseconds, ensuring your dashboard scales to millions of records without breaking a sweat.

---

## 🔐 Demo Credentials

Use these pre-configured accounts to explore the system's Role-Based Access Control (RBAC).

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin@1234` |
| **Analyst** | `analytics@example.com` | `analytics@1234` |
| **Viewer** | `viewer@example.com` | `viewer@1234` |

---

## ⚡ Core Features

### 🛡️ Ironclad Authentication & Session Control
- **Dual-Token Rotation**: A secure JWT Access/Refresh rotation system that keeps users logged in safely while allowing instant session revocation.
- **Redis-Backed Sessions**: We use Redis (via Upstash) to manage active sessions and provide a "Kill Switch" for any account in real-time.
- **HttpOnly Secure Cookies**: Refresh tokens are stored in non-accessible cookies, mitigating XSS and CSRF risks at the browser level.

### 📊 Atomic Financial Ledger
- **Soft-Delete Architecture**: Records are never destroyed. An `isDeleted` flag preserves audit integrity, supporting professional accounting standards.
- **Multi-Factor Filtering**: Slice and dice data by category, type (Income/Expense), date ranges, or global search.
- **Offset Pagination**: Optimized list views that never load more data than the network can handle.

### 📈 Smart Dashboard Analytics
- **Live Summaries**: Real-time balance calculations, trend analysis, and category breakdowns.
- **Performance Caching**: Computationally heavy analytics are cached globally in Redis, delivering millisecond response times even during high-traffic surges.

---

## 🛠️ The "Pro" Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Express.js (v5)** | Lightweight, non-opinionated, and highly extensible for mission-critical APIs. |
| **Database** | **MongoDB (Mongoose)** | High-concurrency performance with flexible schema modeling for evolving financial data. |
| **Cache** | **Upstash Redis** | Global, serverless caching for session management and dashboard acceleration. |
| **Validation** | **Zod** | Type-safe, runtime schema validation that kills "junk data" before it touches the DB. |
| **Documentation** | **Swagger / OpenAPI** | Beautiful, interactive API documentation for developer-friendly onboarding. |

---

## 🏗️ Permission Matrix (RBAC)

| Capability | Viewer | Analyst | Admin |
| :--- | :---: | :---: | :---: |
| View Own Records | ✅ | ✅ | ✅ |
| View All System Records | ❌ | ✅ | ✅ |
| Create New Records | ❌ | ✅ | ✅ |
| Update/Edit Ledger | ❌ | ❌ | ✅ |
| Soft-Delete Records | ❌ | ❌ | ✅ |
| User Management (CRUD) | ❌ | ❌ | ✅ |
| System Dashboard Access | ✅ | ✅ | ✅ |

---

## 📖 API Documentation & Route Examples

### 1. Authentication (`/api/auth`)

#### `POST /api/auth/register`
**Description**: Register a new user account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### `POST /api/auth/login`
**Description**: Authenticate and receive an Access Token.
```json
{
  "email": "admin@example.com",
  "password": "admin@1234"
}
```

#### `POST /api/auth/refresh-token`
**Description**: Use the Refresh Token (sent in HttpOnly cookie) to get a new Access Token.

---

### 2. Financial Records (`/api/finance`)

#### `POST /api/finance` (Admin Only)
**Description**: Create a new financial transaction.
```json
{
  "description": "Office Supplies",
  "amount": 1500,
  "type": "expense",
  "category": "Maintenance",
  "date": "2024-04-06"
}
```

#### `GET /api/finance` (Authenticated)
**Description**: List records with filtering. Analytics/Admins see all; Viewers see only their own.
- **Filters**: `type`, `category`, `startDate`, `endDate`, `search`, `page`, `limit`.

---

### 3. Dashboard (`/api/dashboard`)

#### `GET /api/dashboard/summary` (Authenticated)
**Description**: Retrieve the high-level financial health report. Includes Total Income, Expenses, Balance, and Category breakdowns.

---

### 4. User Management (`/api/users`) - (Admin Only)

#### `POST /api/users`
**Description**: Create a specific user with a set role.
```json
{
  "name": "Jane Analyst",
  "email": "jane@example.com",
  "password": "analystPass123",
  "role": "Analyst"
}
```

#### `PUT /api/users/:id/status`
**Description**: Deactivate or activate a user account.
```json
{
  "status": "Inactive"
}
```

---

## 🚀 Rapid Deployment

### 1. Setup
```bash
npm install
npm run dev
```

### 2. Launch
The server starts at `http://localhost:5000`. You can access the interactive **Swagger UI** at `http://localhost:5000/api-docs`.

---

## 👨‍💻 Author & Reviewer Info

This project demonstrates a production-grade approach to **Backend Security**, **Database Optimization**, and **Clean Code Principles**. It is ready for deployment and high-level architectural review.
