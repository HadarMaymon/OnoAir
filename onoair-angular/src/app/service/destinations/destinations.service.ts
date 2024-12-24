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
      image: 'https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/shutterstock_1011270001_ss_non-editorial_uqgpzy?_a=BAVARSAP0'
    },
    {
      destinationName: 'Los Angeles',
      airportName: 'Los Angeles International Airport',
      airportWebsite: 'https://www.laairport.com/',
      IATA: 'LAX',
      timeZone: 'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      currency: 'USD',
      image: 'https://www.22places.de/images/2023/06/los-angeles-santa-monica-pier.jpg',
    },
    {
      destinationName: 'Paris',
      airportName: 'Paris International Airport',
      airportWebsite: 'https://www.parisairport.com/',
      IATA: 'CDG',
      timeZone: 'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      currency: 'EUR',
      image: 'https://myfrenchcountryhomemagazine.com/wp-content/uploads/2024/02/city-of-love-hero.jpg',
    },
    {
      destinationName: 'Tokyo',
      airportName: 'Tokyo International Airport',
      airportWebsite: 'https://www.tokyoairport.com/',
      IATA: 'HND',
      timeZone: 'Japan Standard Time (JST) - UTC+9',
      currency: 'JPY',
      image: 'https://images.squarespace-cdn.com/content/v1/5bbcf00a9b8fe874ed2f03d0/1599184835862-QUEZ741IHO7A8U1QP8AI/Shinjuku+Tokyo+Japan.jpeg',
    },
    {
      destinationName: 'San Francisco',
      airportName: 'San Francisco International Airport',
      airportWebsite: 'https://www.sfoairport.com/',
      IATA: 'SFO',
      timeZone: 'Pacific Standard Time (PST) - UTC-8 / UTC-7 (PDT)',
      currency: 'USD',
      image: 'https://media.istockphoto.com/id/476881195/photo/bay-bridge-and-san-francisco-skyline-at-sunset.jpg?s=612x612&w=0&k=20&c=dBeGdmYS8eOufXGT_YdRkuvKfLKUHFYwVaL9gHbkSXo=',
    },
    {
      destinationName: 'Bora Bora',
      airportName: 'Motu Mute Airport',
      airportWebsite: 'https://www.boraboraairport.com/',
      IATA: 'BOB',
      timeZone: 'Fiji Time (FJT) - UTC+12 / UTC+13 (FJST)',
      currency: 'USD',
      image: 'https://www.hotelscombined.co.il/rimg/himg/29/5a/85/ice-879365-98730098-378345.jpg?width=968&height=607&crop=true&watermarkposition=lowerright',
    },
    {
      destinationName: 'Berlin',
      airportName: 'Berlin International Airport',
      airportWebsite: 'https://www.berlinairport.com/',
      IATA: 'BER',
      timeZone: 'Central European Time (CET) - UTC+1 / UTC+2 (CEST)',
      currency: 'EUR',
      image: 'https://www.rayburntours.com/wp-content/uploads/2019/06/Berlin-blog-banner.jpg',
    },
    {
      destinationName: 'Pyongyang',
      airportName: 'Pyongyang International Airport',
      airportWebsite: 'https://www.pyongyangairport.com/',
      IATA: 'PYO',
      timeZone: 'Pyongyang Time (PYT) - UTC+9',
      currency: 'KRW',
      image: 'https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fpyongyang-nk-at-night-v0-bxb3hgwdf9e81.jpg%3Fwidth%3D1080%26crop%3Dsmart%26auto%3Dwebp%26s%3D52d0bc73559c722d6a93b7502765915364a0fc91',
    },
    {
      destinationName: 'Bangkok',
      airportName: 'Suvarnabhumi Airport',
      airportWebsite: 'https://suvarnabhumi.airportthai.co.th/',
      IATA: 'DMK',
      timeZone: 'Indochina Time (ICT) - UTC+7',
      currency: 'THB',
      image: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2461072741.jpg',
    },
    {
      destinationName: 'Dublin',
      airportName: 'Dublin Airport',
      airportWebsite: 'https://www.dublinairport.com/',
      IATA: 'DUB',
      timeZone: 'Irish Standard Time (IST) / Greenwich Mean Time (GMT) - UTC+1 (Summer) / UTC+0 (Winter)',
      currency: 'EUR',
      image: 'https://img.klm.com.cn/images/media/CEB5D191-D488-4DE2-B9C84846ED06D515',
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
