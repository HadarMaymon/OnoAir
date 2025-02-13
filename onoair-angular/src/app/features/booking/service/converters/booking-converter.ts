import { FirestoreDataConverter, DocumentData, Timestamp } from '@firebase/firestore';
import { Booking } from '../../models/booking';
import { Passenger } from '../../models/passenger';
import { BookingStatus } from '../../models/booking-status.enum';
import { Luggage } from '../../models/luggage';


export const bookingConverter: FirestoreDataConverter<Booking> = {
  toFirestore: (booking: Booking): DocumentData => ({
    bookingId: booking.bookingId,
    flightNumber: booking.flightNumber,
    origin: booking.origin,
    destination: booking.destination,
    boarding: booking.boarding instanceof Timestamp 
      ? booking.boarding 
      : Timestamp.fromDate(new Date(booking.boarding)),
    landing: booking.landing instanceof Timestamp 
      ? booking.landing 
      : Timestamp.fromDate(new Date(booking.landing)), 
    numberOfPassengers: booking.numberOfPassengers,
    passengers: booking.passengers.map((p) => ({ 
      name: p.name, 
      id: p.id, 
      luggage: p.luggage || new Luggage
    })),
        image: booking.image || 'assets/images/default-destination.jpg',
    isDynamicDate: booking.isDynamicDate,
    status: booking.status,
  }),

  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    console.log('Firestore bookingConverter received:', data); 

    return new Booking(
      data['bookingId'],
      data['flightNumber'],
      data['origin'],
      data['destination'],
      parseFirestoreTimestamp(data['boarding']), 
      data['departureTime'] || '00:00', 
      parseFirestoreTimestamp(data['landing']), 
      data['arrivalTime'] || '00:00', 
      data['numberOfPassengers'],
      data['passengers']?.map((p: { name: string; id: string; luggage?: any }) => 
        new Passenger(p.name, p.id, new Luggage(p.luggage?.cabin, p.luggage?.checked, p.luggage?.heavy))
    ),      
      data['image'] || 'assets/images/default-destination.jpg',
      data['isDynamicDate'],
      data['status'] as BookingStatus
    );
    
  },
};

/**
 * ✅ Ensures Firestore Timestamps are properly converted.
 */
function parseFirestoreTimestamp(dateValue: any): Date {
  if (!dateValue) return new Date(0); // Default fallback
  if (dateValue instanceof Timestamp) {
    return dateValue.toDate();
  }
  if (typeof dateValue === "object" && "seconds" in dateValue && "nanoseconds" in dateValue) {
    return new Date(dateValue.seconds * 1000);
  }
  return new Date(dateValue);
}
