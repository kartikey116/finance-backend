# Finance Dashboard & Access Control Backend

A robust, role-based backend system built with Node.js and Express to manage users, process financial records, and aggregate dashboard metrics securely.

## 🚀 Architectural Decisions & Tech Stack

This backend was specifically designed to demonstrate real-world production readiness. 
* **Database**: MongoDB (Mongoose) for flexible modeling of financial documents.
* **Caching & Sessions**: Redis (Upstash) is implemented to instantly retrieve dashboard summaries instead of recalculating heavy aggregates, and to manage JWT invalidations on logout securely.
* **Validation**: `Zod` schema validation is implemented strictly at the router layer so bad data is rejected locally before ever reaching business logic or MongoDB.
* **Security layer**: Custom Role Based Access Control (RBAC) middleware guarantees horizontal security between Viewers, Analysts, and Admins.

---

## 📖 Comprehensive API Documentation

Below is the structure of every route available in the system, explaining **what** it does and **why** it was designed that way for this business logic.

> **Authentication Required:** All protected endpoints require a standard `Authorization: Bearer <token>` header to be passed in requests.

### 1. Authentication Module

#### `POST /api/auth/register`
Creates a brand new user account with hashed passwords.
* **Why it exists**: The system needs an entry portal for new users. Setting the default role to `Viewer` ensures that any newly signed-up, unvetted individual has the lowest amount of clearance by default.

#### `POST /api/auth/login`
Authenticates a user via Email and Password and returns a signed JWT token.
* **Why it exists**: This route acts as the gatekeeper. It checks if an account is restricted/banned before firing. Instead of relying solely on frontend state, it also securely plants an `httpOnly` cookie as a fallback to ensure cross-platform compatibility and security.

#### `POST /api/auth/logout`
Logs the user out.
* **Why it exists**: Many basic JWT implementations don't support true logouts (since JWTs are stateless). We built this route to actively delete the active session token from our Redis blocklist, making "instant force logouts" a reality.

---

### 2. User Management Module
*All routes here are strictly restricted to the `Admin` role.*

#### `GET /api/users/`
Retrieves a list of all users in the system.
* **Why it exists**: Allows admins to audit the platform and quickly see who has access, what their roles are, and if they are currently active.

#### `POST /api/users/`
Allows an Admin to securely hand-craft a new user.
* **Why it exists**: For internal corporate environments, administrators usually create accounts and directly assign them `Analyst` or `Admin` privileges without relying on the public `/register` form.

#### `PUT /api/users/:id/status`
Updates a user's `isActive` flag (Bans or unbans users).
* **Why it exists**: This is crucial protection against invalid operations. If an employee is terminated or an account is compromised, Admins must be able to instantly disable their account without deleting their historical database foot-print.

#### `PUT /api/users/:id/role`
Promotes or demotes an existing user (e.g., Viewer -> Analyst).
* **Why it exists**: Demonstrates advanced RBAC. Clear separation of duties requires that access levels can be escalated or revoked seamlessly as user responsibilities shift.

---

### 3. Financial Records Management
*Record manipulation requires Admin or Analyst clearance depending on the payload.*

#### `POST /api/finance/`
Creates a new financial transaction (Income or Expense).
* **Why it exists**: The core function of the app. It relies purely on Zod validation to guarantee numbers are positive and categorizations are strict, preventing "junk data" from ruining aggregate analytics.
* **Access Level**: Admin Only.

#### `GET /api/finance/`
Retrieves paginated financial records with search, date, and category filters.
* **Why it exists**: Dashboard UIs shouldn't load 10,000 records at once. Backend pagination (`skip` and `limit`) speeds up network times drastically. The MongoDB `$regex` addition also enables powerful global search functionality.
* **Access Level**: Analyst, Admin.

#### `GET /api/finance/:id`
Retrieves granular details about a specific financial event.
* **Why it exists**: Critical for debugging individual transactions. Allows Analysts to open a "detailed view" for an isolated expense on the frontend.
* **Access Level**: Analyst, Admin.

#### `PUT /api/finance/:id`
Re-writes or updates properties inside an existing transaction.
* **Why it exists**: Humans make data entry typos. Admins need full CRUD control to correct financial anomalies over time.
* **Access Level**: Admin Only.

#### `DELETE /api/finance/:id`
Deletes a financial record from view.
* **Why it exists**: We implemented a **"Soft Delete"** pattern here. Unlike basic backends that permanently `findByIdAndDelete`, this route flips an `isDeleted` flag. This maintains an immutable historical ledger preventing catastrophic permanent data loss. 
* **Access Level**: Admin Only.

---

### 4. Dashboard Analytics & Insights

#### `GET /api/dashboard/summary`
Aggregates and calculates Total Income, Expenses, Net Balance, Category Totals, Monthly Trends, and Weekly Trends.
* **Why it exists**: Financial reports require complex math across the entire dataset. Doing 5 different calculations severely hits the database. This route uses MongoDB `$aggregate` pipelines to compute all numbers at the database-engine level in milliseconds. We also strapped this endpoint to **Redis**—meaning we cache this computationally heavy payload for an hour, ensuring absolute scale across thousands of concurrent users.
* **Access Level**: Viewer, Analyst, Admin.
