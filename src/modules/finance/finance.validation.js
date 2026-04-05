import { z } from "zod";

export const createFinanceSchema = z.object({
  body: z.object({
    description: z.string().min(3, "Please provide a more detailed description"),
    amount: z.number().positive("Amount must be positive"),
    type: z.preprocess((val) => val?.toLowerCase(), z.enum(["income", "expense"])),
    category: z.string().min(2, "Category is required"),
    date: z.coerce.date().optional(),
    notes: z.string().optional(),
  }),
});

export const updateFinanceSchema = z.object({
  body: z.object({
    description: z.string().min(3).optional(),
    amount: z.number().positive().optional(),
    type: z.preprocess((val) => val?.toLowerCase(), z.enum(["income", "expense"]).optional()),
    category: z.string().min(2).optional(),
    date: z.coerce.date().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid record ID"),
  }),
});

export const listFinanceSchema = z.object({
  query: z.object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const getFinanceByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid record ID"),
  }),
});
