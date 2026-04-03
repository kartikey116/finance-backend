# Finance API Documentation

Welcome to the Finance Dashboard API! This documentation serves as a quick-start guide to the endpoints available.

## Authentication
This API uses **JSON Web Tokens (JWT)** for authentication.
Include the token in the `Authorization` header of all protected requests:
```
Authorization: Bearer <your_jwt_token>
```
If using a browser, a `session_token` cookie will also be accepted automatically.

---

## 1. Auth Module

### `POST /api/auth/register`
Creates a new user.
*   **Body**: 
    *   `name` (String, required): Min 2 chars
    *   `email` (String, required): Valid email
    *   `password` (String, required): Min 6 chars
    *   `role` (Enum, optional): `Viewer`, `Analyst`, or `Admin` (Defaults to `Viewer`)
*   **Access**: Public

### `POST /api/auth/login`
Authenticates a user and returns a token.
*   **Body**: 
    *   `email` (String, required)
    *   `password` (String, required)
*   **Access**: Public

### `POST /api/auth/logout`
Invalidates the current session token in Redis.
*   **Access**: Protected (Any valid user)

---

## 2. User Module
**Access Level**: Admin Only

### `GET /api/users/`
Retrieves a list of all users in the system.

### `POST /api/users/`
Creates a user directly from the backend. (Admin dashboard function)

### `PUT /api/users/:id/status`
Updates a user's active status (e.g., banning/disabling).
*   **Body**: `{ "isActive": boolean }`

### `PUT /api/users/:id/role`
Promotes or demotes a user's role.
*   **Body**: `{ "role": "Viewer" | "Analyst" | "Admin" }`

---

## 3. Finance Entry Module

### `POST /api/finance/`
Creates a new financial record.
*   **Body**: 
    *   `amount` (Number, required): Must be positive
    *   `type` (String, required): `income` or `expense`
    *   `category` (String, required)
    *   `notes` (String, optional)
    *   `date` (ISO Datetime String, optional)
*   **Access**: Admin Only

### `GET /api/finance/`
Retrieves paginated financial records.
*   **Query Params**: `page`, `limit`, `type`, `category`, `search`, `startDate`, `endDate`
*   **Access**: Analyst, Admin

### `GET /api/finance/:id`
Retrieves a specific record by ID.
*   **Access**: Analyst, Admin

### `PUT /api/finance/:id`
Updates a record.
*   **Access**: Admin Only

### `DELETE /api/finance/:id`
Soft-deletes a record.
*   **Access**: Admin Only

---

## 4. Dashboard Summary Module

### `GET /api/dashboard/summary`
Retrieves the aggregated backend metrics, cached natively via Redis.
*   **Returns**: `totalIncome`, `totalExpense`, `netBalance`, `categoryTotals`, `recentActivity`, `monthlyTrends`, and `weeklyTrends`.
*   **Access**: Viewer, Analyst, Admin
