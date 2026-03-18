import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { CreateHotelDTO } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";

async function createHotel(hotelData: CreateHotelDTO) {
  const hotel = await Hotel.create(hotelData);
  logger.info(`Hotel created with id: ${hotel.id}`);

  return hotel;
}

async function getHotelById(hotelId: number) {
  const hotel = await Hotel.findByPk(hotelId);

  if (!hotel) {
    logger.warn(`Hotel with id ${hotelId} not found`);
    throw new NotFoundError(`Hotel with id ${hotelId} not found`);
  }

  logger.info(`Hotel with id ${hotelId} retrieved successfully`);
  return hotel;
}

async function getAllHotels() {
  const hotels = await Hotel.findAll({
    where: {
      deletedAt: null, // Only fetch hotels that are not marked as deleted
    },
  });
  if (!hotels || hotels.length === 0) {
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

async function updateHotel(data: any) {
  const hotel = await Hotel.findByPk(data.id);
  if (!hotel) {
    logger.warn(`Hotel with id ${data.id} not found`);
    throw new NotFoundError(`Hotel with id ${data.id} not found`);
  }

  console.log("DeletedAt Property", hotel.deletedAt);

  if (hotel.deletedAt) {
    logger.warn(`Attempt to update a deleted hotel with id ${data.id}`);
    throw new NotFoundError(`Hotel with id ${data.id} not found`);
    return;
  }

  // Destructure fields from input
  const { name, address, location, ratings, rating_count } = data;

  // Update only if values are provided
  if (name !== undefined) hotel.name = name;
  if (address !== undefined) hotel.address = address;
  if (location !== undefined) hotel.location = location;
  if (ratings !== undefined) hotel.ratings = ratings;
  if (rating_count !== undefined) hotel.rating_count = rating_count;

  // Save updated hotel
  await hotel.save();

  return hotel;
}
export default {
  createHotel,
  getHotelById,
  getAllHotels,
  SoftdeleteHotel,
  updateHotel,
};
