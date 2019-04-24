import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  constructor() { }

  search() {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.6438547,-90.2854294&rankby=distance&type=park&key=REMOVED`;

  }
}
