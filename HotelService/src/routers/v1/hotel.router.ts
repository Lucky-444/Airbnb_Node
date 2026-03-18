import express from "express";
import {
  createHotelHandler,
  getAllHotelsHandler,
  getHotelByIdHandler,
} from "../../controllers/hotel.controller";
import { validateRequestBody } from "../../validators";
import {
  createHotelSchema,
} from "../../validators/hotel.validator";

const hotelRouter = express.Router();

hotelRouter.post(
  "/",
  validateRequestBody(createHotelSchema),
  createHotelHandler,
);
hotelRouter.get(
  "/:id",
  getHotelByIdHandler,
);

hotelRouter.get(
  "/",
  getAllHotelsHandler,
);

export default hotelRouter;
