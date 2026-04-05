# Technical Decisions & Architectural Rationale: Finance Backend

The **Finance Backend** is an enterprise-grade infrastructure designed for ironclad security and high-velocity data processing. Every architectural choice was made to ensure five nines of reliability while maintaining the agility of a modern financial platform.

## Framework & Language: Node.js with Express 5.x
We selected the latest **Express 5.x** for its performance-optimized middleware pipeline and lightweight footprint. Unlike opinionated frameworks, Express provided the "atomic control" necessary to build a custom, high-speed **Role-Based Access Control (RBAC)** layer. This allowed us to implement sophisticated authorization logic (Admin, Analyst, Viewer) without the overhead of heavy abstractions, ensuring that every request is gated by precise, millisecond-fast permission checks.

## Database Strategy: MongoDB & Mongoose 9.x
A NoSQL approach via **MongoDB** was chosen over traditional SQL to support evolving financial schemas (Income/Expense categories) without downtime-inducing migrations. More importantly, we leverage MongoDB’s native **Aggregation Framework ($aggregate)** to compute complex dashboard statistics—trends, balances, and category breakdowns—directly at the database engine level. This "Database-First" aggregation strategy ensures that our analytics scale to millions of transactions without bottlenecking application performance.

## Security & Authentication: JWT Dual-Token Rotation
For authentication, we bypassed "stateless simplicity" in favor of a **Dual-Token (Access + Refresh) Rotation** system. Short-lived Access Tokens (15m) are paired with long-lived Refresh Tokens (7d), the latter stored in **HttpOnly, SameSite=Strict cookies** to mitigate XSS and CSRF risks. Uniquely, active sessions are mirrored in **Redis (Upstash)**, enabling a **"Global Kill Switch"** for instant session revocation—a feature often missing in standard JWT implementations.

## Architecture: Layered Modular Patterns
The codebase follows a strict **Route -> Controller -> Service -> Model** layout. This separation isolates business logic from HTTP transport, making the system highly testable and **microservices-ready**. Each module (Auth, Finance, users) is self-contained; if the dashboard traffic spikes, that single module can be extracted into an independent service with minimal refactoring.

## Performance: Redis Computation Caching
To achieve sub-10ms dashboard response times, we implemented a **Computation-Cache** pattern using Redis. Instead of re-aggregating every finance record on every load, summarized metrics are cached globally. We use a **"Write-Through"** invalidation strategy: only when an Admin creates or modifies a record do we purge the dashboard cache, ensuring all users always see the latest data with maximum speed.

## Data Integrity: Zod & Soft Deletes
Financial applications require absolute auditability. We implemented a **Soft-Delete architecture** where records are flagged, never destroyed, preserving an immutable ledger. Every input is strictly validated by **Zod** schemas, killing "junk data" at the network edge before it ever touches our persistent storage.
