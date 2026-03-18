import { CreateHotelDTO } from "../dto/hotel.dto";
import hotelRepository from "../repositories/hotel.repository";
export async function createHotelService(hotelData: CreateHotelDTO) {
    // Implementation for creating a hotel
    const hotel = await hotelRepository.createHotel(hotelData);
    return hotel;
}

export async function getHotelByIdService(hotelId: number) {
    // Implementation for retrieving a hotel by ID
    const hotel = await hotelRepository.getHotelById(hotelId);
    return hotel;
}


export async function getAllHotelsService() {
    // Implementation for retrieving all hotels
    const hotels = await hotelRepository.getAllHotels();
    return hotels;
}




