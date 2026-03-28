import { createBookingDto } from "../dto/booking.dto";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizedIdempotencyKey,
  getIdempotencyKeyWithLock,
} from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";

import prismaClient from "../prisma/client";

export async function createBookingService(
  createBookingData: createBookingDto,
) {
  const booking = await createBooking({
    userId: createBookingData.userId,
    hotelId: createBookingData.hotelId,
    BookingAmount: createBookingData.BookingAmount,
    totalGuest: createBookingData.totalGuest,
  });

  const idempotencyKey = generateIdempotencyKey();

  await createIdempotencyKey(idempotencyKey, booking.id);

  return {
    bookingId: booking.id,
    idempotencyKey: idempotencyKey,
  };
}


//Added Pessimistic LOCK 
// We gonna Use Select For Update 
export async function confirmBookingService(idempotencyKey: string) {

  return await prismaClient.$transaction(async (txn) => {
    
    const idempotencyKeyData = await getIdempotencyKeyWithLock(idempotencyKey , txn);


    if (!idempotencyKeyData) {
      throw new NotFoundError("Idempotency Key Not Found");
    }

    if (idempotencyKeyData.finalized) {
      throw new BadRequestError(
        "ReBooking Not Possible Or Double Booking Not Possible",
      );
    }
    const booking = await confirmBooking(idempotencyKeyData.bookingId , txn);

    await finalizedIdempotencyKey(idempotencyKey , txn);

    return booking;
  })


  
}
