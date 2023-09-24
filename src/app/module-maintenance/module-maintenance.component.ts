import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-module-maintenance',
  templateUrl: './module-maintenance.component.html',
  styleUrls: ['./module-maintenance.component.css']
})
export class ModuleMaintenanceComponent {


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {


    this.validateSession()

  }

  //variables
  //objeto
  ModulosData: any = []
  moduloDataCreate: any = {}
  moduloDataModify: any = {}
  locationsData: any = {}
  companyData: any = {}
  moduloModify: any = {}
  dataUser: any = {}
  options: any = {}

  //boolena
  header: boolean = true
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  //url
  url: String = "http://localhost:4042/v1"
  page: string = "module-maintenance"




  //bandera de botones
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
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })

  }

  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.Modulo()
      this.optionsValidate()
    } else {
      this.router.navigateByUrl("/")
    }
  }


  //obtine modulos
  Modulo() {
    this.RequestModulo().subscribe(
      (response: any) => this.ResponseModulo(response)
    )
  }

  RequestModulo() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/module", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseModulo(response: any) {
    this.ModulosData = response
  }
  //banderas
  Modify(modulo: any) {
    console.log("modifica")
    this.moduloModify = modulo
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
    this.moduloDataModify = {}
    this.moduloDataCreate = {}
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    console.log("add")

  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.moduloDataModify = {}
    this.moduloDataCreate = {}
  }
  //agrega 
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.moduloDataCreate)
      this.moduloDataCreate.userCreation = this.dataUser.user
      this.RequestModuloSave().subscribe(
        (response: any) => this.ResponseModuloSave(response)
      )

    }
  }
  RequestModuloSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createModulo", this.moduloDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
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
      this.moduloModify.name = this.moduloDataModify.name
      this.moduloModify.userModification = this.dataUser.user
      this.RequestModuloSaveM().subscribe(
        (response: any) => this.ResponseModuloSaveM(response)
      )

    }
  }
  RequestModuloSaveM() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyModule/" + this.moduloModify.idModule, this.moduloModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSaveM(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }
  //finaliza la sesion
  revoke() {
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
    return this.http.get<any>(this.url + "/revoke/" + this.dataUser.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRevoke(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }


}
