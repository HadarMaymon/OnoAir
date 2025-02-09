import { FirestoreDataConverter, DocumentData } from '@firebase/firestore';
import { Booking } from '../../models/booking';
import { Passenger } from '../../../destinations/models/passenger';
import { BookingStatus } from '../../models/booking-status.enum'; // Import the BookingStatus enum

export const bookingConverter: FirestoreDataConverter<Booking> = {
  /**
   * Convert a Booking object into Firestore-compatible format.
   */
  toFirestore: (booking: Booking): DocumentData => ({
    bookingId: booking.bookingId,
    flightNumber: booking.flightNumber,
    origin: booking.origin,
    destination: booking.destination,
    boarding: booking.boarding,
    landing: booking.landing,
    numberOfPassengers: booking.numberOfPassengers,
    passengers: booking.passengers.map((p) => ({
      name: p.name,
      id: p.id,
    })),
    image: booking.image,
    isDynamicDate: booking.isDynamicDate,
    status: booking.status, // ✅ Add the status field
  }),

  /**
   * Convert a Firestore document snapshot into a Booking object.
   */
  fromFirestore: (snapshot) => {
    const data = snapshot.data() as {
      bookingId: string;
      flightNumber: string;
      origin: string;
      destination: string;
      boarding: string;
      landing: string;
      numberOfPassengers: number;
      passengers: { name: string; id: string }[];
      image: string;
      isDynamicDate: boolean;
      status: string; 
    };

    return new Booking(
      data.bookingId,
      data.flightNumber,
      data.origin,
      data.destination,
      data.boarding,
      data.landing,
      data.numberOfPassengers,
      data.passengers.map((p) => new Passenger(p.name, p.id)),
      data.image,
      data.isDynamicDate,
      data.status as BookingStatus 
    );
  },
};
