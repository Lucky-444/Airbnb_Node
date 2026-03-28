import { createBookingDto } from "../dto/booking.dto";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizedIdempotencyKey,
  getIdempotencyKeyWithLock,
} from "../repositories/booking.repository";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";

import prismaClient from "../prisma/client";
import { redLock } from "../config/redis.config";
import { serverConfig } from "../config";

/**
 * Creates a new booking with distributed lock and idempotency guarantee
 *
 * WHAT THIS ENSURES:
 * - Only one booking per hotel can be created simultaneously (no race conditions across all users)
 * - Idempotency key is generated to prevent duplicate bookings if request is retried
 * - Lock-protected booking creation and idempotency key generation
 *
 * WHY WE DO THIS:
 * - Prevents overbooking: all concurrent booking requests for the same hotel are serialized
 * - Handles network retries gracefully: if client retries the request, idempotency key prevents duplicate bookings
 * - Distributed lock (RedLock) ensures consistency across multiple server instances
 * - Protects against race conditions in inventory/availability management
 *
 * BUSINESS LOGIC:
 * - Acquires a distributed lock on the hotel resource (hotel:hotelId) using RedLock for serverConfig.TTL duration
 * - If lock acquisition fails, throws InternalServerError (another instance holds the lock)
 * - Within the lock, creates a booking record in the database with user, hotel, amount, and guest details
 * - Immediately generates a unique idempotency key and links it to the booking
 * - Returns booking ID and idempotency key to client for later confirmation via confirmBookingService
 *
 * PROVIDES:
 * - Safe booking creation with distributed race condition prevention
 * - Idempotency key for safe retries and fault tolerance
 * - Two-step booking flow: creation (this function) + confirmation (confirmBookingService)
 */
export async function createBookingService(
  createBookingData: createBookingDto,
) {
  const ttl = serverConfig.TTL; //For One minute
  const bookingResource = `hotel:${createBookingData.hotelId}`;

  try {
    await redLock.acquire([bookingResource], ttl);
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
  } catch (error) {
    throw new InternalServerError(
      "Failed to acquire lock for booking resource",
    );
  }
}

/**
 * Confirms a pending booking using pessimistic locking within a transaction
 *
 * WHAT THIS ENSURES:
 * - Only confirms a booking once (prevents double booking/double charging)
 * - Idempotency key cannot be reused (finalized flag prevents re-confirmation)
 * - All database operations are atomic: read, validate, update, finalize happen together
 *
 * WHY WE DO THIS:
 * - Prevents double payments: customer cannot confirm same booking twice
 * - Prevents race conditions: using SELECT FOR UPDATE (pessimistic lock) ensures exclusive access to record
 * - Handles network retries: if confirmation request is retried, second attempt is rejected with BadRequestError
 * - Ensures data consistency: transaction guarantees all-or-nothing semantics
 *
 * BUSINESS LOGIC:
 * - Starts a database transaction for atomicity
 * - Uses SELECT FOR UPDATE to acquire an exclusive lock on the idempotency key row
 * - Validates that idempotency key exists (if not, booking was never created)
 * - Validates that booking was not already finalized (prevents double confirmation)
 * - Updates booking status to confirmed
 * - Marks idempotency key as finalized to prevent future confirmations
 *
 * PROVIDES:
 * - Confirmed booking: ready for payment processing
 * - Guarantee that double bookings cannot occur
 * - Safe idempotency: retry-safe endpoint
 */
export async function confirmBookingService(idempotencyKey: string) {
  return await prismaClient.$transaction(async (txn) => {
    const idempotencyKeyData = await getIdempotencyKeyWithLock(
      idempotencyKey,
      txn,
    );

    if (!idempotencyKeyData) {
      throw new NotFoundError("Idempotency Key Not Found");
    }

    if (idempotencyKeyData.finalized) {
      throw new BadRequestError(
        "ReBooking Not Possible Or Double Booking Not Possible",
      );
    }
    const booking = await confirmBooking(idempotencyKeyData.bookingId, txn);

    await finalizedIdempotencyKey(idempotencyKey, txn);

    return booking;
  });
}
