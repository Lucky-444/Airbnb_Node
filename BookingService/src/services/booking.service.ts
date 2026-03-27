import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizedIdempotencyKey,
  getIdempotencyKey,
} from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";

export async function createBookingService(
  userId: number,
  hotelId: number,
  bookingAmount: number,
  totalGuest: number,
) {
  const booking = await createBooking({
    userId,
    hotelId,
    BookingAmount: bookingAmount,
    totalGuest,
  });

  const idempotencyKey = generateIdempotencyKey();

  await createIdempotencyKey(idempotencyKey, booking.id);

  return {
    bookingId: booking.id,
    idempotencyKey: idempotencyKey,
  };
}

export async function finallizeBookingService(idempotencyKey: string) {
  const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);

  if (!idempotencyKeyData) {
    throw new NotFoundError("Idempotency Key Not Found");
  }

  if (idempotencyKeyData.finalized) {
    throw new BadRequestError(
      "ReBooking Not Possible Or Double Booking Not Possible",
    );
  }
  const booking = await confirmBooking(idempotencyKeyData.bookingId);

  await finalizedIdempotencyKey(idempotencyKey);

  return booking;
}
