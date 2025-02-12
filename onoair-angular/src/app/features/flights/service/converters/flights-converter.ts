import { FirestoreDataConverter, DocumentData, Timestamp } from '@firebase/firestore';
import { Flight } from '../../model/flight';
import { FlightStatus } from '../../model/flight-status.enum';

export const flightConverter: FirestoreDataConverter<Flight> = {
  toFirestore: (flight: Flight): DocumentData => ({
    flightNumber: flight.flightNumber,
    origin: flight.origin,
    destination: flight.destination,
    date: Timestamp.fromDate(flight.date), // Convert Date to Firestore Timestamp
    departureTime: flight.departureTime,
    arrivalDate: Timestamp.fromDate(flight.arrivalDate), // Convert Date to Firestore Timestamp
    arrivalTime: flight.arrivalTime,
    price: flight.price,
    image: flight.image,
    availableSeats: flight.availableSeats,
    isDynamicDate: flight.isDynamicDate,
    status: flight.status,
    hasBookings: flight.hasBookings ?? false, // Ensure field exists
  }),

  fromFirestore: (snapshot) => {
    const data = snapshot.data() as {
      flightNumber: string;
      origin: string;
      destination: string;
      date: Timestamp;
      departureTime: string;
      arrivalDate: Timestamp;
      arrivalTime: string;
      price: number;
      image: string;
      availableSeats: number;
      isDynamicDate: boolean;
      status: FlightStatus;
      hasBookings: boolean;
    };

    return new Flight(
      data.flightNumber,
      data.origin,
      data.destination,
      data.date.toDate(), // Convert Timestamp to Date
      data.departureTime,
      data.arrivalDate.toDate(), // Convert Timestamp to Date
      data.arrivalTime,
      data.price,
      data.image,
      data.availableSeats,
      data.isDynamicDate,
      data.status,
      data.hasBookings ?? false // Ensure default value if missing
    );
  },
};
