# Finance Backend: Enterprise-Grade Financial Infrastructure

[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-green.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-red.svg)](https://upstash.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Rotation-orange.svg)](https://jwt.io/)
[![Validation](https://img.shields.io/badge/Validation-Zod-magenta.svg)](https://zod.dev/)

**A high-performance, role-based financial data management engine designed for security, auditability, and massive scale.**

---

## Live Deployment

| Service | URL |
| :--- | :--- |
| **API Documentation** | [https://finance-backend-3o7n.onrender.com/api-docs/](https://finance-backend-3o7n.onrender.com/api-docs/#/) |
| **Backend Base URL** | [https://finance-backend-3o7n.onrender.com](https://finance-backend-3o7n.onrender.com) |
| **System Health** | [https://finance-backend-3o7n.onrender.com/api/health](https://finance-backend-3o7n.onrender.com/api/health) |

---

## The Engineering Vision

Modern financial platforms demand more than just "CRUD." They require absolute data integrity, ironclad role-based security, and lightning-fast analytics. The **Finance Backend** was architected to solve three core engineering challenges:

1.  **Multi-User Data Isolation**: We prevent "Horizontal Privilege Escalation" by enforcing ownership checks at the database query layer—not just the frontend. 
2.  **Strictly Enforced RBAC**: A multi-tiered authorization matrix (Admin, Analyst, Viewer) is built natively into the middleware stack, ensuring zero data leakage.
3.  **Atomic Data Aggregation**: We leverage MongoDB's native `$aggregate` engine and **Redis caching** to compute complex financial trends in milliseconds, ensuring your dashboard scales to millions of records without breaking a sweat.

---

## Demo Credentials

Use these pre-configured accounts to explore the system's Role-Based Access Control (RBAC).

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin@1234` |
| **Analyst** | `analytics@example.com` | `analytics@1234` |
| **Viewer** | `viewer@example.com` | `viewer@1234` |

---

## Core Features

### Ironclad Authentication & Session Control
- **Dual-Token Rotation**: A secure JWT Access/Refresh rotation system that keeps users logged in safely while allowing instant session revocation.
- **Redis-Backed Sessions**: We use Redis (via Upstash) to manage active sessions and provide a "Kill Switch" for any account in real-time.
- **HttpOnly Secure Cookies**: Refresh tokens are stored in non-accessible cookies, mitigating XSS and CSRF risks at the browser level.

### Atomic Financial Ledger
- **Soft-Delete Architecture**: Records are never destroyed. An `isDeleted` flag preserves audit integrity, supporting professional accounting standards.
- **Multi-Factor Filtering**: Slice and dice data by category, type (Income/Expense), date ranges, or global search.
- **Offset Pagination**: Optimized list views that never load more data than the network can handle.

---

## Permission Matrix (RBAC)

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

## API Documentation & Route Examples

### 1. Authentication (`/api/auth`)

- **POST `/api/auth/register`**
  - **Description**: Register a new user account.
  - **Example**: `{"name": "John Doe", "email": "john@example.com", "password": "securePassword123"}`

- **POST `/api/auth/login`**
  - **Description**: Authenticate and receive Access/Refresh tokens.
  - **Example**: `{"email": "admin@example.com", "password": "admin@1234"}`

- **POST `/api/auth/refresh-token`**
  - **Description**: Refresh the access token using the HttpOnly cookie.

- **POST `/api/auth/logout`**
  - **Description**: Revoke session and clear cookies.

---

### 2. Dashboard (`/api/dashboard`)

- **GET `/api/dashboard/summary`**
  - **Description**: High-level financial report (Total Income, Expenses, Balance, Category Breakdown).
  - **Access**: Viewer, Analyst, Admin (Scoped by role).

---

### 3. Financial Records (`/api/finance`)

- **POST `/api/finance`**
  - **Description**: Create a new income or expense.
  - **Access**: Analyst, Admin.
  - **Example**: `{"description": "Freelance Payment", "amount": 2500, "type": "income", "category": "Salary", "date": "2024-04-06"}`

- **GET `/api/finance`**
  - **Description**: List paginated records with filters (type, category, search).
  - **Access**: Authenticated (Scoped).

- **GET `/api/finance/{id}`**
  - **Description**: Retrieve specific transaction details.
  - **Access**: Owner or Admin.

- **PUT `/api/finance/{id}`**
  - **Description**: Update an existing record.
  - **Access**: Admin.
  - **Example**: `{"description": "Revised Amount", "amount": 2600}`

- **DELETE `/api/finance/{id}`**
  - **Description**: Soft-delete a record (audit-safe).
  - **Access**: Admin.

---

### 4. User Management (`/api/users`)

- **GET `/api/users`**
  - **Description**: Full user directory audit.
  - **Access**: Admin.

- **POST `/api/users`**
  - **Description**: Manually seed/create a user with a specific role.
  - **Access**: Admin.
  - **Example**: `{"name": "Alice", "email": "alice@hr.com", "password": "password123", "role": "Analyst"}`

- **PUT `/api/users/{id}/status`**
  - **Description**: Instantly ban/unban a user (Active/Inactive).
  - **Access**: Admin.
  - **Example**: `{"status": "Inactive"}`

- **PUT `/api/users/{id}/role`**
  - **Description**: Promote or demote a user's permissions.
  - **Access**: Admin.
  - **Example**: `{"role": "Admin"}`

---

### 5. System Health (`/api/health`)

- **GET `/api/health`**
  - **Description**: Real-time status of Database, Redis, and Uptime.

---

## 🛣️ Future-Proofing / Roadmap

This project is built to scale beyond a simple dashboard. Our next phase focused on enterprise readiness:

- **[ ] Multi-Factor Authentication (MFA)**: Integration with TOTP/SMS for account security.
- **[ ] AI-Powered Spending Insights**: Using ML models to predict future cashflow trends and detect anomalies in categories.
- **[ ] Event-Driven Webhooks**: Notifying external systems (Slack/Email) whenever a high-amount transaction is recorded.
- **[ ] Professional Reporting (PDF/CSV)**: Automated generation of monthly financial ledgers for tax and audit purposes.
- **[ ] Microservices Ready**: Containerization with Docker and Kubernetes for high-availability horizontal scaling.

---

## Rapid Deployment

### 1. Setup
```bash
npm install
npm run dev
```

### 2. Launch
The server starts at `http://localhost:5000`. Access the interactive **Swagger UI** for live testing at `http://localhost:5000/api-docs`.

---

## Engineering Leadership

This project serves as a showcase of **Clean Architecture**, **Layered Security**, and **Real-World Optimization**. It is ready for deployment and architectural scrutiny.
