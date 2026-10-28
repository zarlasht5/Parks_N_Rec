import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

/*
 * Developer note: how the ZIP-code park search works
 *
 * Flow
 *   1. AppComponent.submit() passes the 5-digit ZIP from the input to search(zip).
 *   2. search() calls the Google Geocoding API
 *      (maps/api/geocode/json?address=<zip>) and reads the lat/lng of the first result.
 *   3. It then calls the Places Nearby Search API
 *      (maps/api/place/nearbysearch/json) with location=<lat,lng>, rankby=distance,
 *      type=park.
 *   4. search() returns the promise chain, which resolves to the Places `results`
 *      array. submit() assigns it to AppComponent.parks in .then().
 *   5. The template renders each result's `name` as a mat-chip.
 *
 * Verified 2026-10-28: a search for ZIP 63109 returned nearby parks when run
 * locally with a valid API key.
 *
 * Known gaps (as of this note)
 *   - The Places web service does not send CORS headers, so browser calls only
 *     work with a CORS-disabling extension. The Access-Control-* headers set here
 *     are response headers and have no effect on a request. A backend proxy or the
 *     Maps JavaScript SDK (PlacesService) would remove that dependency.
 *   - apiKey is a placeholder ('REMOVED'). Don't commit a real key; load it from
 *     src/environments instead.
 *   - There's no error handling. handleError() is defined but never wired in, and
 *     an empty geocode result (invalid ZIP) throws on results[0].
 *   - The spec (googlemaps.service.spec.ts) only checks that the service is created.
 *     It configures no HttpClient provider, so it will likely fail to inject
 *     HttpClient until HttpClientTestingModule is imported.
 */

interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

interface NearbySearchResponse {
  results: Array<{
    name?: string;
    vicinity?: string;
    place_id?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  private apiKey = 'REMOVED';

  constructor(private http: HttpClient) { }


  /* requires CORS - currently using an extension to allow CORS */
  search(zip: string): any {
    //let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.6438547,-90.2854294&rankby=distance&type=park&key=REMOVED`;
    let httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      })
    };

    let url1 = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${this.apiKey}`;


    return this.http.get<GeocodeResponse>(url1, httpOptions1).toPromise().then(

      response => {
        console.log(response.results[0].geometry.location);
        let lat = response.results[0].geometry.location.lat;
        let long = response.results[0].geometry.location.lng;

        let url2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;

        let httpOptions2 = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
          }),
          params: new HttpParams()
            .set('location', `${lat},${long}`)
            .set('rankby', 'distance')
            .set('type', 'park')
            .set('key', this.apiKey)
        };

        return this.http.get<NearbySearchResponse>(url2, httpOptions2).toPromise().then(response => {
          console.log(response);

          return response.results;
        });
      }
      // ,
      // error => {
      //   console.log(error);
      // }
    );




    //setTimeout(function () { return of([2]).toPromise() }, 500000);

  }

  // Error handling 
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


}
