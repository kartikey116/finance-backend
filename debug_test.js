import request from "supertest";
import app from "./src/app.js";
import mongoose from "mongoose";
import { env } from "./src/config/env.js";

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  
  const res = await request(app).post("/api/auth/register").send({
    name: "Test Viewer",
    email: "viewer.test@example.com",
    password: "password123",
    role: "Viewer"
  });
  
  console.log("Status:", res.status);
  console.log("Body:", JSON.stringify(res.body, null, 2));
  
  await mongoose.connection.close();
}

run();
