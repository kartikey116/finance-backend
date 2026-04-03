import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Viewer", "Analyst", "Admin"]),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["Viewer", "Analyst", "Admin"]),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
});
