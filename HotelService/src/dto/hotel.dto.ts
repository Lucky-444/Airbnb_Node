export type CreateHotelDTO = {
    name: string;
    location: string;
    address: string;
    ratings?: number;
    rating_count?: number;
}