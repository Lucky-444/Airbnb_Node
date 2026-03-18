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

async function getAllHotels() {
    const hotels = await Hotel.findAll(
        {
            where: {
                deletedAt: null, // Only fetch hotels that are not marked as deleted
            }
        }
    );
    if(!hotels || hotels.length === 0) {
        logger.warn("No hotels found in the database");
        throw new NotFoundError("No hotels found");
    }
    logger.info(`Retrieved all hotels, count: ${hotels.length}`);
    return hotels;
}

async function SoftdeleteHotel(hotelId: number) {
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
        logger.warn(`Hotel with id ${hotelId} not found`);
        throw new NotFoundError(`Hotel with id ${hotelId} not found`);
    }
    hotel.deletedAt = new Date();
    await hotel.save();

    logger.info(`Hotel with id ${hotelId} marked as deleted`);
    return true;
}

export default {
    createHotel,
    getHotelById,
    getAllHotels,
    SoftdeleteHotel,
}