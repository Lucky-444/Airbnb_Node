import express from "express";
import {
  createHotelHandler,
  getAllHotelsHandler,
  getHotelByIdHandler,
  SoftdeleteHotelHandler,
  updateHotelHandler,
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

hotelRouter.delete(
  "/:id",
  SoftdeleteHotelHandler,
);

hotelRouter.put(
  "/:id",
  updateHotelHandler,
);

hotelRouter.patch(
  "/:id",
  updateHotelHandler,
);



export default hotelRouter;
