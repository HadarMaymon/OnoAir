import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Destination } from '../models/destination';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot,getDocs } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { destinationConverter } from './converter/destination-converter';

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {

  private destinationsSubject = new BehaviorSubject<Destination[]>([]);
  destinations$ = this.destinationsSubject.asObservable();

  private destinations: Destination[] = [
    new Destination(
      'New York',
      'John F. Kennedy International Airport',
      'https://www.jfkinternationalairport.com/',
      'JFK',
      'Eastern Standard Time (EST) - UTC-5 / UTC-4 (EDT)',
      'USD',
      'https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/shutterstock_1011270001_ss_non-editorial_uqgpzy?_a=BAVARSAP0'
    ),
    new Destination(
      'Los Angeles',
      'Los Angeles International Airport',
      'https://www.laairport.com/',
      'LAX',
      'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      'USD',
      'https://www.22places.de/images/2023/06/los-angeles-santa-monica-pier.jpg'
    ),
    new Destination(
      'Paris',
      'Paris International Airport',
      'https://www.parisairport.com/',
      'CDG',
      'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      'EUR',
      'https://myfrenchcountryhomemagazine.com/wp-content/uploads/2024/02/city-of-love-hero.jpg'
    ),
    new Destination(
      'Tokyo',
      'Tokyo International Airport',
      'https://www.tokyoairport.com/',
      'HND',
      'Japan Standard Time (JST) - UTC+9',
      'JPY',
      'https://images.squarespace-cdn.com/content/v1/5bbcf00a9b8fe874ed2f03d0/1599184835862-QUEZ741IHO7A8U1QP8AI/Shinjuku+Tokyo+Japan.jpeg'
    ),
    new Destination(
      'San Francisco',
      'San Francisco International Airport',
      'https://www.sfoairport.com/',
      'SFO',
      'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      'USD',
      'https://media.istockphoto.com/id/476881195/photo/bay-bridge-and-san-francisco-skyline-at-sunset.jpg?s=612x612&w=0&k=20&c=dBeGdmYS8eOufXGT_YdRkuvKfLKUHFYwVaL9gHbkSXo='
    ),
    new Destination(
      'Bora Bora',
      'Motu Mute Airport',
      'https://www.boraboraairport.com/',
      'BOB',
      'Fiji Time (FJT) - UTC+12 / UTC+13 (FJST)',
      'USD',
      'https://www.hotelscombined.co.il/rimg/himg/29/5a/85/ice-879365-98730098-378345.jpg?width=968&height=607&crop=true&watermarkposition=lowerright'
    ),
    new Destination(
      'Berlin',
      'Berlin International Airport',
      'https://www.berlinairport.com/',
      'BER',
      'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      'EUR',
      'https://www.rayburntours.com/wp-content/uploads/2019/06/Berlin-blog-banner.jpg'
    ),
    new Destination(
      'Pyongyang',
      'Pyongyang International Airport',
      'https://www.pyongyangairport.com/',
      'PYO',
      'Pyongyang Time (PYT) - UTC+9',
      'KRW',
      'https://www.hotelnorthkorea.com/medias/article/big/80/pyongyang.jpg'
    ),
    new Destination(
      'Bangkok',
      'Suvarnabhumi Airport',
      'https://suvarnabhumi.airportthai.co.th/',
      'DMK',
      'Indochina Time (ICT) - UTC+7',
      'THB',
      'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2461072741.jpg'
    ),
    new Destination(
      'Dublin',
      'Dublin Airport',
      'https://www.dublinairport.com/',
      'DUB',
      'Irish Standard Time (IST) / Greenwich Mean Time (GMT) - UTC+1 (Summer) / UTC+0 (Winter)',
      'EUR',
      'https://img.klm.com.cn/images/media/CEB5D191-D488-4DE2-B9C84846ED06D515'
    )
  ];


  constructor(private firestore: Firestore) {}

  /**
   * Upload static destinations to Firestore.
   */
  uploadStaticDestinations(): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const uploadPromises = this.destinations.map((destination) => {
      const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
      return setDoc(destinationDoc, destination).catch((error) => {
        console.error(`Error uploading destination ${destination.destinationName}:`, error);
      });
    });

    return Promise.all(uploadPromises)
      .then(() => console.log('All static destinations uploaded successfully!'))
      .catch((error) => console.error('Error uploading static destinations:', error));
  }

  /**
   * Sync destinations with Firestore in real-time.
   */
  syncDestinations(): void {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    onSnapshot(destinationCollection, (snapshot) => {
      const destinations = snapshot.docs.map((doc) => doc.data());
      this.destinationsSubject.next(destinations);
    });
  }

  /**
   * Get a single destination by its name.
   */
  getDestinationByName(name: string): Observable<Destination | undefined> {
    return this.destinations$.pipe(
      map((destinations) =>
        destinations.find((destination) => destination.destinationName.toLowerCase() === name.toLowerCase())
      )
    );
  }

  /**
   * Add a new destination to Firestore.
   */
  addDestination(destination: Destination): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
    return setDoc(destinationDoc, destination).then(() => {
      console.log(`Destination ${destination.destinationName} added successfully.`);
    });
  }

  /**
   * Update an existing destination in Firestore.
   */
  updateDestination(destination: Destination): Promise<void> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
    const destinationDoc = doc(destinationCollection, destination.IATA); // Use IATA as document ID
    return setDoc(destinationDoc, destination).then(() => {
      console.log(`Destination ${destination.destinationName} updated successfully.`);
    });
  }

  /**
   * Delete a destination from Firestore.
   */
  deleteDestination(IATA: string): Promise<void> {
    const destinationDoc = doc(this.firestore, 'destinations', IATA).withConverter(destinationConverter);
    return deleteDoc(destinationDoc).then(() => {
      console.log(`Destination with IATA ${IATA} deleted successfully!`);
    });
  }

  getAllDestinations(): Promise<Destination[]> {
    const destinationCollection = collection(this.firestore, 'destinations').withConverter(destinationConverter);
  
    return getDocs(destinationCollection).then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data() as Destination);
    });
  }  
}