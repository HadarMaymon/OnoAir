import { FirestoreDataConverter, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Destination } from '../../models/destination';

export const destinationConverter: FirestoreDataConverter<Destination> = {
  toFirestore: (destination: Destination): any => ({
    destinationName: destination.destinationName,
    airportName: destination.airportName,
    airportWebsite: destination.airportWebsite,
    IATA: destination.IATA,
    timeZone: destination.timeZone,
    currency: destination.currency,
    image: destination.image,
  }),

  fromFirestore: (snapshot: QueryDocumentSnapshot): Destination => {
    const data = snapshot.data() as {
      destinationName: string;
      airportName: string;
      airportWebsite: string;
      IATA: string;
      timeZone: string;
      currency: string;
      image: string;
    };
    return new Destination(
      data['destinationName'], // Access via index signature to comply with TypeScript rules
      data['airportName'],
      data['airportWebsite'],
      data['IATA'],
      data['timeZone'],
      data['currency'],
      data['image']
    );
  },
};
