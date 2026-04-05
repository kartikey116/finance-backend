express → backend framework
mongoose → MongoDB ORM
dotenv → env variables
cors → frontend connection
helmet → security headers
morgan → logging

JWT → authentication
bcrypt → password hashing

src/
│
├── modules/                # 🔥 Feature-based structure (BEST)
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.model.js
│   │   ├── auth.routes.js
│   │   └── auth.validation.js
│   │
│   ├── user/
│   │   ├── user.controller.js
│   │   ├── user.service.js
│   │   ├── user.model.js
│   │   ├── user.routes.js
│   │   └── user.validation.js
│   │
│   ├── finance/
│   │   ├── finance.controller.js
│   │   ├── finance.service.js
│   │   ├── finance.model.js
│   │   ├── finance.routes.js
│   │   └── finance.validation.js
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.service.js
│   │   └── dashboard.routes.js
│
├── middleware/             # Global middlewares
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── rateLimiter.js
│
├── config/                 # Config files
│   ├── db.js
│   ├── redis.js
│   ├── env.js
│
├── utils/                  # Helper functions
│   ├── apiResponse.js
│   ├── logger.js
│   └── constants.js
│
├── jobs/                   # Background jobs (performance 🚀)
│   ├── cronJobs.js
│   └── queue.js
│
├── cache/                  # Redis caching layer
│   └── cache.service.js
│
├── database/               # DB optimization layer
│   ├── indexes.js
│   └── seed.js
│
├── app.js                  # Express app
└── server.js               # Entry point


{
  "name": "viewer",
  "email": "viewer@example.com",
  "password": "viewer@1234",
  "role": "Viewer"
}
{
  "email": "admin@example.com",
  "password": "admin@1234"
}
{
  "name": "analytics",
  "email": "analytics@example.com",
  "password": "analytics@1234",
  "role": "Analyst"
}

