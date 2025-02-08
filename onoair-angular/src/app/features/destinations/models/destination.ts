import { DestinationStatus } from '../../destinations/models/destination-status.enum';

export class Destination {
    constructor(
      public destinationName: string,
      public airportName: string,
      public airportWebsite: string,
      public IATA: string,
      public timeZone: string,
      public currency: string,
      public image: string,
      public status: DestinationStatus = DestinationStatus.Active

    ) {}
  
  }