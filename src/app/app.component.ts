import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

import { GooglemapsService } from '../googlemaps.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'parksAndRec';
  zipcode = '';
  parks = [];


  constructor(private service: GooglemapsService) {

  }

  submit() {
  console.log('submit button clicked');
  console.log(this.zipcode);

  this.service.search(this.zipcode).then(
    (response: any) => {
      console.log(response);
      this.parks = response;
    }
  );
}


}