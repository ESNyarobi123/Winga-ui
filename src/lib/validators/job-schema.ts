import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200),
  description: z.string().min(30, "Description must be at least 30 characters"),
  budget: z.number().min(1000, "Budget must be at least 1,000 TZS"),
  deadline: z.string().min(1, "Deadline is required").refine((s) => {
    const d = new Date(s);
    return d > new Date();
  }, "Deadline must be a future date"),
  category: z.string().min(1, "Select a category").optional(),
  experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]).optional(),
  tags: z.array(z.string()).optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  attachmentUrls: z.array(z.string()).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;
