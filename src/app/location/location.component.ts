import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(){
    this.locationData()
    this.CompanyData()
  }


//variables
locationsData: any = [];
BussinessRules: any = [];
modificar:boolean =false;
url: String = "http://localhost:4042/v1"

locationData() {
  this.RequestLocation().subscribe(
    (response: any) => this.ResponseLocation(response)
  )
}

RequestLocation() {
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.get<any>(this.url + "/location", httpOptions).pipe(
    catchError(e => "1")
  )
}

ResponseLocation(response: any) {
  this.locationsData = response
  console.log(this.locationsData)
  console.log("Se obtuvo roles")
}

CompanyData() {
  this.RequestCompany().subscribe(
    (response: any) => this.ResponseCompany(response)
  )
}

RequestCompany() {
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.get<any>(this.url + "/bussinesRules", httpOptions).pipe(
    catchError(e => "1")
  )
}

ResponseCompany(response: any) {
  this.BussinessRules = response
  console.log(this.BussinessRules)
  console.log("Se obtuvo configuracion de empresa")

}


}
