import { z } from "zod";
export const createBookingSchema = z.object({
  userId: z.coerce.number().int(),

  hotelId: z.coerce.number().int(),

  totalGuest: z.coerce.number().int().positive(),

  BookingAmount: z.coerce.number().positive(),
});