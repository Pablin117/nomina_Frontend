import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nomina_Frontend';
  //urlData: String = "http://localhost:4042/v1"
  //urlData2: String = "http://localhost:4042/v2"
  urlData: String = "http://107.20.75.74:4042/v1"
  urlData2: String = "http://107.20.75.74:4042/v2"
}
