import { z } from "zod";

export const createHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Hotel location is required"),
  address: z.string().min(1, "Hotel address is required"),
  ratings: z.number().min(0).max(5).optional(),
  rating_count: z.number().min(0).optional(),
});

export const getHotelByIdSchema = z.object({
  id: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "number",
        received: "string",
        message: "Hotel ID must be a number",
      });
      return z.NEVER;
    }
    return parsed;
  }),
});
