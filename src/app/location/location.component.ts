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
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.CompanyService()
    this.locationService()
    this.validateSession()
    this.optionsValidate()
  }

   //variables
   locationsData: any = []
   companyData: any = []
   modify: boolean = false
   add: boolean = false
   tab: boolean = true
   locationDataCreate: any = {}
   locationDataModify: any = {}
   options: any = {}
   btnAdd: boolean = false
   btnUpdate: boolean = false
   print: boolean = false
   exporte: boolean = false
   dataUser: any = {}
   header:boolean = true
   url: String = "http://localhost:4042/v1";

  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

    console.log(this.options)
    let page = "location"
    let permisos: any = {}

    this.options.forEach((item: any) => {
      if (item.page === page) {
        permisos = item.permisos
      }
    })

    permisos.forEach((item: any) => {
      this.btnAdd = item.up == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })

  }




validateSession(){
  if(this.dataUser != null){
    console.log("activo")
  }else{
    this.router.navigateByUrl("/")
  }
}




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
   // console.log(this.locationsData)
  }


  ResponseCompany(response: any) {
    this.companyData = response
    console.log("Se obtuvo configuracion de empresa")
    //console.log(this.companyData)

  }

  getCompanyName(idCompany: number): string {
    for (let x = 0; x < this.companyData.length; x++) {
      if (this.companyData[x].idCompany == idCompany) {
        return this.companyData[x].name
      }
    }
    return '';
  }


  Modify(location: any) {
    console.log(location)
    console.log("modifica")
    this.locationDataModify = location
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false

    this.locationDataCreate = {}
  }


  Add() {
    this.modify = false
    this.add = true
    this.tab = false
     this.header = false
    console.log("add")

  }
  backWelcome(){
    this.router.navigateByUrl("/home")
  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true

    this.locationDataCreate = {}
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.locationDataCreate.userCreation = this.dataUser.user
      console.log(this.locationDataCreate)
      this.RequestLocationSave().subscribe(
        (response:any) => this.ResponseLocationSave(response)
      )
    }
  }

  RequestLocationSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createLocation", this.locationDataCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLocationSave(response: any) {
    console.log(response)

    if(response.code == 0 ){
      alert(response.message)
      console.log("Se guardo")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)

    }

  }

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {

      this.locationDataModify.userModification = this.dataUser.user
    console.log(this.locationDataModify)

      this.RequestLocationModify().subscribe(
        (response:any) => this.ResponseLocationModify(response)
      )
    }
  }


  RequestLocationModify() {
    console.log("se agrega")
   console.log(this.locationDataModify)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyLocation" , this.locationDataModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLocationModify(response: any) {
    console.log(response)
    if(response.code == 0 ){
      alert(response.message)
      console.log("Se actualizo")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }
  }

  revoke(){
    console.log("salida")
  console.log(this.dataUser.session)
  this.RequestRevoke().subscribe(
    (response: any) => this.ResponseRevoke(response)
  )
  }


  RequestRevoke() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/revoke/"+ this.dataUser.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRevoke(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {

      localStorage.clear()
       this.router.navigateByUrl("/")
    }

  }

}
