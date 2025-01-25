import { FirestoreDataConverter, DocumentData } from '@firebase/firestore';
import { Booking } from '../../models/booking';
import { Passenger } from '../../../destinations/models/passenger';

export const bookingConverter: FirestoreDataConverter<Booking> = {
    toFirestore: (booking: Booking): DocumentData => ({
      bookingId: booking.bookingId,
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
    }),
  
    fromFirestore: (snapshot) => {
      const data = snapshot.data() as {
        bookingId: string;
        origin: string;
        destination: string;
        boarding: string;
        landing: string;
        numberOfPassengers: number;
        passengers: { name: string; id: string }[];
        image: string;
        isDynamicDate: boolean;
      };
  
      return new Booking(
        data.bookingId,
        data.origin,
        data.destination,
        data.boarding,
        data.landing,
        data.numberOfPassengers,
        data.passengers.map((p) => new Passenger(p.name, p.id)),
        data.image,
        data.isDynamicDate
      );
    },
  };
  