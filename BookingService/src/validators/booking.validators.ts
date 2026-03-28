import { z } from "zod";
export const createBookingSchema = z.object({
  userId: z.coerce.number().int({ message: "User ID must be an integer" }),

  hotelId: z.coerce.number().int({ message: "Hotel ID must be an integer" }),

  totalGuest: z.coerce
    .number()
    .int()
    .positive({ message: "Total guests must be greater than 0" }),

  BookingAmount: z.coerce
    .number()
    .positive({ message: "Booking amount must be greater than 0" }),
});