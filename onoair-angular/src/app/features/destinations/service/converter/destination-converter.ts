import { FirestoreDataConverter, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Destination } from '../../models/destination';
import { DestinationStatus } from '../../models/destination-status.enum'; // Import the enum

export const destinationConverter: FirestoreDataConverter<Destination> = {
  toFirestore: (destination: Destination): any => ({
    destinationName: destination.destinationName,
    airportName: destination.airportName,
    airportWebsite: destination.airportWebsite,
    IATA: destination.IATA,
    timeZone: destination.timeZone,
    currency: destination.currency,
    image: destination.image,    
    status: destination.status, // ✅ Add this line to store status
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
      status: string; // ✅ Ensure status is retrieved as a string
    };

    return new Destination(
      data['destinationName'], 
      data['airportName'],
      data['airportWebsite'],
      data['IATA'],
      data['timeZone'],
      data['currency'],
      data['image'],
      data['status'] as DestinationStatus || DestinationStatus.Active 
    );
  },
};
