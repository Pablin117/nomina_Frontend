import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.RoleData()
    this.optionsValidate()
  }
  //variables
  RolesData: any = [];
  url: String = "http://localhost:4042/v1"

  roleDataCreate: any = {}
  roleDataModify: any = {}
  companyData: any = {}
  roleModify: any = {}
  dataUser: any = {}
  header: boolean = true
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false

 //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "role"
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


  validateSession() {
    if (this.dataUser != null) {
      console.log("activo")
    } else {
      this.router.navigateByUrl("/")
    }
  }




  RoleData() {
    this.RequestRole().subscribe(
      (response: any) => this.ResponseRole(response)
    )
  }

  RequestRole() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/role", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRole(response: any) {
    this.RolesData = response

    console.log("Se obtuvo roles")

  }

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


  Modify(rol: any) {
    console.log("modifica")
    this.roleModify = rol
    this.header = false
    this.add = false
    this.tab = false
    this.modify = true
    this.roleDataModify = {}
    this.roleDataCreate = {}
  }

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    console.log("add")

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
    this.roleDataModify = {}
    this.roleDataCreate = {}
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.roleDataCreate)
      this.roleDataCreate.userCreation = this.dataUser.user
      this.RequestRoleSave().subscribe(
        (response: any) => this.ResponseRoleSave(response)
      )

    }
  }
  RequestRoleSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createRol", this.roleDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }


  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.roleModify.name = this.roleDataModify.name
      this.roleModify.userModification = this.dataUser.user
      this.RequestRoleSaveM().subscribe(
        (response: any) => this.ResponseRoleSaveM(response)
      )

    }
  }
  RequestRoleSaveM() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyRol", this.roleModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSaveM(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }


  }


}
