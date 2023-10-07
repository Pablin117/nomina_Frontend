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
  btnDelete: boolean = false
  print: boolean = false
  exporte: boolean = false
  //url
  pageUrl: string = "role-user"
  url: String = "http://localhost:4042/v1"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0
  //objetos
  roleUserDataModify: any = {}
  roleUserDataCreate: any = {}
  roleUserData: any = []
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
      if (item.page === this.pageUrl) {
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



  //banderas
  Modify(id: any) {
    console.log("modifica")
    this.roleUserDataModify = id
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false

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
    this.roleUserDataCreate = {}
    this.roleUserDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }
  //obtiene Role User
  roleUser() {
    this.requestRolUser().subscribe(
      (response: any) => this.responseRolUser(response)
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
  responseRolUser(response: any) {
    this.roleUserData = response
    this.userService()
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  getRoleName(idRole: number): string {
    for (let x = 0; x < this.roleData.length; x++) {
      if (this.roleData[x].idRole == idRole) {
        return this.roleData[x].name
      }
    }
    return '';
  }

  //para eliminar

  Delete(response: any) {
    console.log(response)
    
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
    return this.http.delete<any>(this.url + "/deleteUserRole/" + response.idUser, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {
    if (response.code == 0) {

      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }

  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.roleUserDataModify.userModification = this.dataUser.user
      this.roleUserDataModify = this.roleUserDataModify
      this.requestRolUserUpdate().subscribe(
        (response: any) => this.responseGenderUpdate(response)
      )
    }
  }

  requestRolUserUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateUserRole/" + this.roleUserDataModify.idUser, this.roleUserDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGenderUpdate(response: any) {
    if (response.code == 0) {

      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }


  //agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.roleUserDataCreate.userCreation = this.dataUser.user
      console.log(this.roleUserDataCreate);
      
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
    return this.http.post<any>(this.url + "/createUserRole", this.roleUserDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseRolUserSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }

  }


  //llamar info del usaurio 
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

    this.RequestRole().subscribe(
      (response: any) => this.ResponseRole(response)
    )

  }
  //obtiene roles
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
