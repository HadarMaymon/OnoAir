import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Destination {
  destinationName: string;
  airportName: string;
  airportWebsite: string;
  IATA: string;
  timeZone: string;
  currency: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {

  private destinations: Destination[] = [
    {
      destinationName: 'New York',
      airportName: 'John F. Kennedy International Airport',
      airportWebsite: 'https://www.jfkinternationalairport.com/',
      IATA: 'JFK',
      timeZone: 'Eastern Standard Time (EST) - UTC-5 / UTC-4 (EDT)',
      currency: 'USD',
      image: '/assets/destinations/new_york.jpeg',
    },
    {
      destinationName: 'Los Angeles',
      airportName: 'Los Angeles International Airport',
      airportWebsite: 'https://www.laairport.com/',
      IATA: 'LAX',
      timeZone: 'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      currency: 'USD',
      image: '/assets/destinations/los-angeles.jpeg',
    },
    {
      destinationName: 'Paris',
      airportName: 'Paris International Airport',
      airportWebsite: 'https://www.parisairport.com/',
      IATA: 'CDG',
      timeZone: 'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      currency: 'EUR',
      image: '/assets/destinations/paris.jpeg',
    },
    {
      destinationName: 'Tokyo',
      airportName: 'Tokyo International Airport',
      airportWebsite: 'https://www.tokyoairport.com/',
      IATA: 'HND',
      timeZone: 'Japan Standard Time (JST) - UTC+9',
      currency: 'JPY',
      image: '/assets/destinations/tokyo.jpeg',
    },
    {
      destinationName: 'San Francisco',
      airportName: 'San Francisco International Airport',
      airportWebsite: 'https://www.sfoairport.com/',
      IATA: 'SFO',
      timeZone: 'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      currency: 'USD',
      image: '/assets/destinations/san-francisco.jpeg',
    },
    {
      destinationName: 'Bora Bora',
      airportName: 'Motu Mute Airport',
      airportWebsite: 'https://www.boraboraairport.com/',
      IATA: 'BOB',
      timeZone: 'Fiji Time (FJT) - UTC+12 / UTC+13 (FJST)',
      currency: 'USD',
      image: '/assets/destinations/bora-bora.jpeg',
    },
    {
      destinationName: 'Berlin',
      airportName: 'Berlin International Airport',
      airportWebsite: 'https://www.berlinairport.com/',
      IATA: 'BER',
      timeZone: 'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      currency: 'EUR',
      image: '/assets/destinations/berlin.jpeg',
    },
    {
      destinationName: 'Pyongyang',
      airportName: 'Pyongyang International Airport',
      airportWebsite: 'https://www.pyongyangairport.com/',
      IATA: 'PYO',
      timeZone: 'Pyongyang Time (PYT) - UTC+9',
      currency: 'KRW',
      image: '/assets/destinations/pyongyang.jpeg',
    },
    {
      destinationName: 'Thailand',
      airportName: 'Suvarnabhumi Airport',
      airportWebsite: 'https://suvarnabhumi.airportthai.co.th/',
      IATA: 'DMK',
      timeZone: 'Indochina Time (ICT) - UTC+7',
      currency: 'THB',
      image: '/assets/destinations/thailand.jpeg',
    },
    {
      destinationName: 'Dublin',
      airportName: 'Dublin Airport',
      airportWebsite: 'https://www.dublinairport.com/',
      IATA: 'DUB',
      timeZone: 'Irish Standard Time (IST) / Greenwich Mean Time (GMT) - UTC+1 (Summer) / UTC+0 (Winter)',
      currency: 'EUR',
      image: '/assets/destinaitons/dublin.jpeg',
    }
  ];

  getDestinationByName(name: string): Observable<Destination | undefined> {
    const destination = this.destinations.find(d => d.destinationName === name);
    return of(destination);
  }  

  addDestination(destination: Destination): Observable<void> {
    this.destinations.push(destination);
    return of();
  }
  

  getDestinations(): Observable<Destination[]> {
    return of(this.destinations);
  }
}
