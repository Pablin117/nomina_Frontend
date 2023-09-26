import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent {
  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.validateSession()

  }


  //variables

  //boolean
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  //url
  page:string ="role-user"
  url: String = "http://localhost:4042/v1"
  //objetos
  roleUserDataModify: any = {}
  roleUserDataCreate: any = {}
  roleUserData: any = []
  roleUserModify: any = {}
  dataUser: any = {}
  selectedUser: any = []
  selectedRole: any = []
  userData: any = []
  roleData: any = []
  options: any = {}


  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.roleUser()
      this.userService()

    } else {
      this.router.navigateByUrl("/")
    }
  }


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



  //banderas
  Modify(id: any) {
    console.log("modifica")
    this.roleUserModify = id
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
    this.roleUserDataModify = {}

  }
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    this.selectedUser = {}
    this.selectedRole = {}
    console.log("add")
  }
  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }

  roleUser() {
    this.requestRolUser().subscribe(
      (response: any) => this.responseGender(response)
    )

  }
  requestRolUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/userRole", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGender(response: any) {
    console.log(response)
    this.roleUserData = response
  }

  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.roleUserModify.userModification = this.dataUser.user
      this.requestRolUserUpdate().subscribe(
        (response: any) => this.responseGenderUpdate(response)
      )
    }
  }

  requestRolUserUpdate() {
    console.log("aqui")
    console.log(this.roleUserModify)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyuserRole", this.roleUserModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGenderUpdate(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }


  //agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.roleUserDataCreate.userCreation = this.dataUser.user
      this.requestRolUserSave().subscribe(
        (response: any) => this.responseRolUserSave(response)
      )
    }
  }

  requestRolUserSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/userAsignRole", this.roleUserDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseRolUserSave(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


  //llamar info del usaurio y roles
  userService() {
    this.RequestUser().subscribe(
      (response: any) => this.ResponseUser(response)
    )
  }

  RequestUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/user", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseUser(response: any) {
    this.userData = response;
    console.log("Se obtuvo la data del userrio");
    console.log(response)

    this.RequestRole().subscribe(
      (response: any) => this.ResponseRole(response)
    )

  }

  roleService() {
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
    this.roleData = response;
    console.log("Se obtuvo la data de los roles");
    console.log(response)


  }


  //cierre de sesion
  revoke() {
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
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }
  }





}
