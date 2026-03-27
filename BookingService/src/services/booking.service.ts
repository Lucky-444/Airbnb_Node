export async function createBookingService(bookingData: any) {
  // Logic to create a new booking
  // This is a placeholder implementation. You should replace it with actual database logic.
  const booking = {
    id: Math.floor(Math.random() * 1000), // Simulating an auto-generated ID
    ...bookingData,
    createdAt: new Date(),
  };
  return booking; 
}


export async function finallizeBookingService(bookingId: number) {
  // Logic to finalize a booking
  // This is a placeholder implementation. You should replace it with actual database logic.
  const finalizedBooking = {
    id: bookingId,
    status: "finalized",
    finalizedAt: new Date(),
  };
  return finalizedBooking; 
}