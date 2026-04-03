import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import User from "../src/modules/user/user.model.js";

describe("Auth API Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterAll(async () => {
    // Cleanup mock data
    await User.deleteMany({ email: "testunit@example.com" });
    await mongoose.connection.close();
  });

  it("should register a new test user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Unit User",
        email: "testunit@example.com",
        password: "securepassword",
        role: "Viewer"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should fail validation if password is too short", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Short Auth",
        email: "testunit-short@example.com",
        password: "123" // Too short!
      });

    expect(res.statusCode).toBe(400); // Bad Request from Zod
    expect(res.body.success).toBe(false);
  });

  it("should fail to register duplicate user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Dupe Test",
        email: "testunit@example.com", // Already registered
        password: "securepassword"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("should successfully log in the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testunit@example.com",
        password: "securepassword"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });
});
