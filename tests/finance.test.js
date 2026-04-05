import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import User from "../src/modules/user/user.model.js";

describe("Finance RBAC API Endpoints", () => {
  let viewerToken;
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    const viewerRes = await request(app).post("/api/auth/register").send({
      name: "Test Viewer",
      email: "viewer.test@example.com",
      password: "password",
      role: "Viewer"
    });
    viewerToken = viewerRes.body.data.token;
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Test Admin",
      email: "admin.test@example.com",
      password: "password",
      role: "Admin"
    });
    adminToken = adminRes.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ["viewer.test@example.com", "admin.test@example.com"] } });
    await mongoose.connection.collection("finances").deleteMany({ category: "Test Category" });
    await mongoose.connection.close();
  });

  it("should deny a Viewer from creating a finance record", async () => {
    const res = await request(app)
      .post("/api/finance")
      .set("Authorization", `Bearer ${viewerToken}`)
      .send({
        amount: 500,
        type: "income",
        category: "Test Category"
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/permission/i);
  });

  it("should allow an Admin to create a finance record", async () => {
    const res = await request(app)
      .post("/api/finance")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        amount: 500,
        type: "income",
        category: "Test Category"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("amount", 500);
  });
});
