import { Prisma } from "@prisma/client";
import PrismaClient from "../prisma/client";


export async function createBooking(bookingData: Prisma.BookingCreateInput) {
  const booking = await PrismaClient.booking.create({
    data: bookingData,
  });
  return booking;
}

export async function createIdempotencyKey(key: string, bookingId: number) {
  const idempotencyKey = await PrismaClient.idempotencyKey.create({
    data: {
      key: key,
      booking: {
        connect: {
          id: bookingId,
        },
      },
    },
  });

  return idempotencyKey;
}

export async function getIdempotencyKey(key: string) {
  const idempotencyKey = await PrismaClient.idempotencyKey.findUnique({
    where: {
      key,
    },
  });

  return idempotencyKey;
}

// 1st Create The Booking then Going To Create the Idempotency Key with the Booking ID and the Key
// 2nd Way Booking and Idempotency Key creation in parallel
//Then afer that we can check if the key exist or not in the database if exist we will return the booking else we will create the booking and the key and return the booking
//and Update the booking status to finalized after that we can delete the key from the database or we can keep it for future reference
//and Update the idempotency key with the booking id after that we can check if the key exist or not in the database if exist we will return the booking else we will create the booking and the key and return the booking

export async function getBookingById(bookingId: number) {
  // Logic to retrieve a booking by its ID
  const booking = await PrismaClient.booking.findUnique({
    where: { id: bookingId },
  });
  return booking;
}


export async function confirmBooking(bookingId : number) {
  const booking  = await PrismaClient.booking.update({
    where : {
      id : bookingId
    },
    data : {
      status : "CONFIRMED"
    }
  })

  return booking;
}

export async function finalizedIdempotencyKey(key : string){
  const idempotencyKey = await PrismaClient.idempotencyKey.update({
    where:{
      key ,
    },
    data : {
      finalized : true
    }
  })

  return idempotencyKey;
}
