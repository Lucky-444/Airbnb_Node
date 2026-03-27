import { Prisma } from "@prisma/client";
import PrismaClient from "../prisma/client";

export async function createBooking(bookingData: Prisma.BookingCreateInput) {
  const booking = await PrismaClient.booking.create({
    data: bookingData,
  });
  return booking; 
}

export async function getBookingById(bookingId: number) {
  // Logic to retrieve a booking by its ID
  const booking = await PrismaClient.booking.findUnique({
    where: { id: bookingId },
  });
  return booking;
}
