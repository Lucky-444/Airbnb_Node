import express from "express";
import {
  createHotelHandler,
  getHotelByIdHandler,
} from "../../controllers/hotel.controller";
import { validateRequestBody } from "../../validators";
import {
  createHotelSchema,
  getHotelByIdSchema,
} from "../../validators/hotel.validator";

const hotelRouter = express.Router();

hotelRouter.post(
  "/",
  validateRequestBody(createHotelSchema),
  createHotelHandler,
);
hotelRouter.get(
  "/:id",
  validateRequestBody(getHotelByIdSchema),
  getHotelByIdHandler,
);

export default hotelRouter;
