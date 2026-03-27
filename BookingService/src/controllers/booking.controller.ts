import { Request, Response } from "express";
import {
  confirmBookingService,
  createBookingService,
} from "../services/booking.service";

export const createBookingHandler = async (req: Request, res: Response) => {
  const booking = await createBookingService(req.body);

  res.status(201).json({
    success: true,
    data: booking,
    message: "Booking created successfully",
  });
};
export const confirmBookingHandler = async (req: Request, res: Response) => {
  const bookingConfirm = await confirmBookingService(req.params.idempotencyKey);

  res.status(200).json({
    bookingId: bookingConfirm.id,
    status: bookingConfirm.status,
  });
};
