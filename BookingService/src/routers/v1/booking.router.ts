import express from "express";
import { createBookingSchema } from "../../validators/booking.validators";
import { validateRequestBody } from "../../validators";
import { confirmBookingHandler, createBookingHandler } from "../../controllers/booking.controller";


const BookingRouter = express.Router();

BookingRouter.post(
  "/",
  validateRequestBody(createBookingSchema),
  createBookingHandler, 
);


BookingRouter.post('/confirm/:idempotencyKey' , confirmBookingHandler)

export default BookingRouter;



