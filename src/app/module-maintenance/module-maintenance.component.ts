import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-module-maintenance',
  templateUrl: './module-maintenance.component.html',
  styleUrls: ['./module-maintenance.component.css']
})
export class ModuleMaintenanceComponent {
  //variables
  ModulosData: any = [];
  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  moduloDataCreate: any = {}
  moduloDataModify: any = {}
  locationsData: any = {};
  companyData: any = {};
  moduloModify: any = {};
  dataUser: any = {}
  VarModulo: any = [];
  VarName:any=[];
  header: boolean = true
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false


  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.Modulo();
    this.validateSession()
    this.optionsValidate()
  }
  constructor(private http: HttpClient,private router: Router) { }

  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "module-maintenance"
    let permisos: any = {}

    this.options.forEach((item: any) => {
      if (item.page === page) {
        permisos = item.permisos
      }
    })

    permisos.forEach((item: any) => {

      if (item.up == 1) {
        this.btnAdd = true
      }
      if (item.update == 1) {
        this.btnUpdate = true
      }
      if (item.print == 1) {
        this.print = true
      }
      if (item.export == 1) {
        this.exporte = true
      }
    })

  }


  validateSession(){
    if(this.dataUser != null){
      console.log("activo")
    }else{
      this.router.navigateByUrl("/")
    }
  }

  Modulo(){
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

    console.log("Se obtuvo roles")
  }

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

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.moduloDataCreate)
      this.moduloDataCreate.userCreation = this.dataUser.user
      this.RequestModuloSave().subscribe(
        (response:any) => this.ResponseModuloSave(response)
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
    return this.http.post<any>(this.url + "/createModulo", this.moduloDataCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSave(response: any) {
    if(response.code == 0){
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }


  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.moduloModify.name = this.moduloDataModify.name
      this.moduloModify.userModification = this.dataUser.user
      this.RequestModuloSaveM().subscribe(
        (response:any) => this.ResponseModuloSaveM(response)
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
    return this.http.put<any>(this.url + "/modifyModule/"+this.moduloModify.idModule, this.moduloModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSaveM(response: any) {
    if(response.code == 0){
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }
  }

  revoke() {
    console.log("salida")
    console.log(this.dataUser.session)
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
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
