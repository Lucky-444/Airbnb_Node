import { Request, Response } from "express";
import { CreateHotelDTO } from "../dto/hotel.dto";
import {
  createHotelService,
  getHotelByIdService,
} from "../services/hotel.service";
import logger from "../config/logger.config";

export async function createHotelHandler(req: Request, res: Response) {
  try {
    const hotelData: CreateHotelDTO = req.body;

    const hotel = await createHotelService(hotelData);

    logger.info(`Hotel created successfully with id: ${hotel.id}`);

    res.status(201).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hotel",
    });
  }
}

export async function getHotelByIdHandler(req: Request, res: Response) {
  try {
    const hotelId = parseInt(req.params.id, 10);
         
    const hotel = await getHotelByIdService(hotelId);

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve hotel",
    });
  }
}
