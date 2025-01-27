import { FirestoreDataConverter, DocumentData } from '@firebase/firestore';
import { Flight } from '../../model/flight';

export const flightConverter: FirestoreDataConverter<Flight> = {
  toFirestore: (flight: Flight): DocumentData => ({
    flightNumber: flight.flightNumber,
    origin: flight.origin,
    destination: flight.destination,
    date: flight.date,
    departureTime: flight.departureTime,
    duration: flight.duration,
    price: flight.price,
    image: flight.image,
    availableSeats: flight.availableSeats,
    isDynamicDate: flight.isDynamicDate,
  }),

  fromFirestore: (snapshot) => {
    const data = snapshot.data() as {
      flightNumber: string;
      origin: string;
      destination: string;
      date: string;
      departureTime: string;
      duration: string;
      arrivalDate: string;
      arrivalTime: string;
      price: number;
      image: string;
      availableSeats: number;
      isDynamicDate: boolean;
    };

    return new Flight(
      data.flightNumber,
      data.origin,
      data.destination,
      data.date,
      data.departureTime,
      data.duration,
      data.arrivalDate,
      data.arrivalTime,
      data.price,
      data.image,
      data.availableSeats,
      data.isDynamicDate
    );
  },
};
