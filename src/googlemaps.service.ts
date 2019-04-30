import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  private apiKey = 'REMOVED';

  constructor(private http: HttpClient) { }


  /* requires CORS - currently using an extension to allow CORS */
  search() {
    //let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.6438547,-90.2854294&rankby=distance&type=park&key=REMOVED`;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      }),
      params: new HttpParams()
        .set('location', '38.6438547,-90.2854294')
        .set('rankby', 'distance')
        .set('type', 'park')
        .set('key', this.apiKey)
    };



    return this.http.get(url, httpOptions);
    // .pipe(
    //   retry(1),
    //   catchError(this.handleError)
    // )
  }

  // Error handling 
  handleError(error) {
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
