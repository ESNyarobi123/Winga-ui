import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/** Only CLIENT and FREELANCER can register; ADMIN is assigned manually. */
export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^(\+255|0)[67]\d{8}$/, "Invalid Tanzanian phone")
    .optional()
    .or(z.literal("")),
  role: z.enum(["CLIENT", "FREELANCER"], {
    error: "Choose whether you want to Hire or Work",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
