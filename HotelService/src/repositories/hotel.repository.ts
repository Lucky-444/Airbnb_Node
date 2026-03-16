import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { CreateHotelDTO } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";


async function createHotel(hotelData : CreateHotelDTO) {
         const hotel = await Hotel.create(hotelData);
         logger.info(`Hotel created with id: ${hotel.id}`);

         return hotel;
}

async function getHotelById(hotelId: number) {
    const hotel = await Hotel.findByPk(hotelId);

    if(!hotel) {
         logger.warn(`Hotel with id ${hotelId} not found`);
         throw new NotFoundError(`Hotel with id ${hotelId} not found`)
    }

    logger.info(`Hotel with id ${hotelId} retrieved successfully`);
    return hotel;
}

export default {
    createHotel,
    getHotelById
}