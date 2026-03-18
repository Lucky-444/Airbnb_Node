import { Request, Response } from "express";
import { CreateHotelDTO } from "../dto/hotel.dto";
import {
  createHotelService,
  getAllHotelsService,
  getHotelByIdService,
} from "../services/hotel.service";
import logger from "../config/logger.config";
import { StatusCodes } from "http-status-codes";

export async function createHotelHandler(req: Request, res: Response) {
  try {
    const hotelData: CreateHotelDTO = req.body;

    const hotel = await createHotelService(hotelData);

    logger.info(`Hotel created successfully with id: ${hotel.id}`);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create hotel",
    });
  }
}

export async function getHotelByIdHandler(req: Request, res: Response) {
  console.log(req.params);

  try {
    const hotelId = parseInt(req.params.id, 10);

    const hotel = await getHotelByIdService(hotelId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve hotel",
    });
  }
}

export async function getAllHotelsHandler(req: Request, res: Response) {
  try {
    const hotels = await getAllHotelsService();
    res.status(StatusCodes.OK).json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve hotels",
    });
  }
}
