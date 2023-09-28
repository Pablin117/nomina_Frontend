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
    this.validateSession()

  }

  //variables

  //objecto
  locationsData: any = []
  companyData: any = []
  locationDataCreate: any = {}
  locationDataModify: any = {}

  options: any = {}
  dataUser: any = {}

  //boolean
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  btnDelete: boolean = false
  print: boolean = false
  exporte: boolean = false
  modify: boolean = false
  add: boolean = false
  tab: boolean = true

  //url
  page = "location"
  url: String = "http://localhost:4042/v1";



  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.CompanyService()
      this.locationService()
      this.optionsValidate()
    } else {
      this.router.navigateByUrl("/")
    }
  }

  //obtiene botones con permisos
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let permisos: any = {}

    this.options.forEach((item: any) => {
      if (item.page === this.page) {
        permisos = item.permisos
      }
    })

    permisos.forEach((item: any) => {
      this.btnAdd = item.up == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
      this.btnDelete = item.down == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })

  }



  //para eliminar

  Delete(response: any) {

    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }

  requestDelete(response: any) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<any>(this.url + "/deleteLocation/" + response.idLocation, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {
    if (response.code == 0) {

      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }



  //obtine sucursales
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
  ResponseLocation(response: any) {
    this.locationsData = response;

  }


  //obtiene la empresa
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


  ResponseCompany(response: any) {
    this.companyData = response
  }

  //retorna el nombre de la compañia con el id company
  getCompanyName(idCompany: number): string {
    for (let x = 0; x < this.companyData.length; x++) {
      if (this.companyData[x].idCompany == idCompany) {
        return this.companyData[x].name
      }
    }
    return '';
  }

  //modifica
  Modify(response: any) {
    this.locationDataModify = response
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }

  //banderas
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false

  }
  backWelcome() {
    this.router.navigateByUrl("/home")
  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.locationDataCreate = {}
    this.locationDataModify = {}
    this.ngOnInit()
  }


  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.locationDataCreate.userCreation = this.dataUser.user

      this.RequestLocationSave().subscribe(
        (response: any) => this.ResponseLocationSave(response)
      )
    }
  }

  RequestLocationSave() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createLocation", this.locationDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLocationSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


  //modifica
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.locationDataModify.userModification = this.dataUser.user

      this.RequestLocationModify().subscribe(
        (response: any) => this.ResponseLocationModify(response)
      )
    }
  }


  RequestLocationModify() {
    console.log("se agrega")

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateLocation/" + this.locationDataModify.idLocation, this.locationDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLocationModify(response: any) {

    if (response.code == 0) {
      alert(response.message)
      console.log("Se actualizo")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }

  //finaliza la sesion
  revoke() {
    console.log("salida")

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
    return this.http.get<any>(this.url + "/revoke/" + this.dataUser.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRevoke(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {

      localStorage.clear()
      this.router.navigateByUrl("/")
    }

  }

}
