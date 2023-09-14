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

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.CompanyService()
    this.locationService()
  }


  //variables
  locationsData: any = [];
  companyData: any = [];
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true
  locationDataCreate: any = {}
  locationDataModify: any = {}
  dataIndex: any = {}
  url: String = "http://localhost:4042/v1"


  locationService() {
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

  CompanyService() {
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

  ResponseLocation(response: any) {
    this.locationsData = response;
    console.log("Se obtuvo sucursales");
    console.log(this.locationsData)
  }


  ResponseCompany(response: any) {
    this.companyData = response
    console.log("Se obtuvo configuracion de empresa")
    console.log(this.companyData)

  }

  getCompanyName(idCompany: number): string {
    for (let x = 0; x < this.companyData.length; x++) {
      if (this.companyData[x].idcompany == idCompany) {
        return this.companyData[x].name
      }
    }
    return '';
  }


  Modify(index: any) {
    console.log(index)
    console.log("modifica")
    this.dataIndex = index
    this.add = false
    this.tab = false
    this.modify = true
    this.locationDataModify = {}
    this.locationDataCreate = {}
  }


  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    console.log("add")
    
  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.locationDataCreate)
    }
  }

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      console.log(this.locationDataModify)
    }
  }


  

}
