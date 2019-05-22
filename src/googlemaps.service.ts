import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  private apiKey = 'REMOVED';

  constructor(private http: HttpClient) { }


  /* requires CORS - currently using an extension to allow CORS */
  search(zip): any {
    //let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.6438547,-90.2854294&rankby=distance&type=park&key=REMOVED`;
    let httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      })
    };

    let url1 = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${this.apiKey}`;


    this.http.get(url1, httpOptions1).toPromise().then(

      response => {
        let result: any = response;
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

        this.http.get(url2, httpOptions2).toPromise().then(response => {
          let result: any = response;
          console.log(result);

          return result.results;
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
