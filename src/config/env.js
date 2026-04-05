import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.JWT_SECRET && process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_SECRET = process.env.JWT_ACCESS_SECRET;
}

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string().url("Must be a valid MongoDB URI"),
  JWT_ACCESS_SECRET: z.string().min(10, "JWT_ACCESS_SECRET must be at least 10 characters long"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET must be at least 10 characters long"),
  ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
  REDIS_URL: z.string().url("Must be a valid Redis URL").optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const { success, data, error } = envSchema.safeParse({
  ...process.env,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET_KEY,
});

if (!success) {
  console.error("Invalid environment variables:", JSON.stringify(error.format(), null, 2));
  throw new Error("Invalid environment variables");
}

export const env = data;
