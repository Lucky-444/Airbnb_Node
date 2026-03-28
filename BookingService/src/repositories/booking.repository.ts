import { Prisma , IdempotencyKey } from "@prisma/client";
import PrismaClient from "../prisma/client";
import { validate as isvalidUUID } from "uuid";
import { BadRequestError, NotFoundError} from "../utils/errors/app.error";

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

export async function getIdempotencyKeyWithLock(key: string , txn : Prisma.TransactionClient) {
  // const idempotencyKey = await txn.idempotencyKey.findFirst({
  //   where: {
  //     key,
  //   },
  //   lock :{
  //     mode : "forUpdate",
  //   }
  // });

  if(!isvalidUUID(key)){
    throw new BadRequestError("Invalid IdempotencyKey Format")
  }

 
  const idempotencyKey : Array<IdempotencyKey>  = await txn.$queryRaw`
    SELECT *
    FROM "IdempotencyKey"
    WHERE "key" = ${key}
    FOR UPDATE
  `;

  console.log("Idempotency Key Lock" , idempotencyKey);
  
  if(!idempotencyKey || idempotencyKey.length === 0){
    throw new NotFoundError("Idempotency Key Not Found");
  }

  return idempotencyKey[0];
  
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


export async function confirmBooking(bookingId : number , txn : Prisma.TransactionClient) {

  const booking  = await txn.booking.update({
    where : {
      id : bookingId
    },
    data : {
      status : "CONFIRMED"
    }
  })

  return booking;
}

export async function finalizedIdempotencyKey(key : string , txn : Prisma.TransactionClient){
  
  const idempotencyKey = await txn.idempotencyKey.update({
    where:{
      key ,
    },
    data : {
      finalized : true
    }
  })

  return idempotencyKey;
}
