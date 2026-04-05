import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import financeRoutes from "./modules/finance/finance.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

setupSwagger(app);

app.use(rateLimiter);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

export default app;