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

  //objects
  rolDataModify: any = {}
  rolDataCreate: any = {}
  roleData: any = []
  dataUser: any = {}
  options: any = {}


  // pagina y url
  url: String = "http://localhost:4042/v1"
  page: String = "role"
  pages = 1;
  pageSize = 0
  tamColeccion: number = 0


  //valida sesiones
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.rolData()
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
      this.btnDelete = item.down == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })
  }


  //Obtiene datos de rol
  rolData() {
    this.Requestrol().subscribe(
      (response: any) => this.Responserol(response)
    )
  }
  Requestrol() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/role", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  Responserol(response: any) {
    this.roleData = response
    console.log(response)
    this.tamColeccion = response.length
    this.pageSize = 10

  }

  //formulario para modificar
  modForm() {
    let formularioValido: any = document.getElementById("modForm")

    this.rolDataModify.userModification = this.dataUser.user
    console.log(this.rolDataModify)
    this.RequestrolUpdate().subscribe(
      (response: any) => this.ResponserolUpdate(response)
    )
  }





  RequestrolUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateRol/" + this.rolDataModify.idRole, this.rolDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponserolUpdate(response: any) {
   if(response.code == 999){
     this.revoke()
   }else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }

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
    return this.http.delete<any>(this.url + "/deleteRol/" + response.idRole +"/"+this.dataUser.user, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {
   
    if(response.code == 999 ){
   
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }

  //formulario para agregar 

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.rolDataCreate.userCreation = this.dataUser.user
      this.RequestrolSave().subscribe(
        (response: any) => this.ResponserolSave(response)
      )
    }
  }
  RequestrolSave() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createRol", this.rolDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponserolSave(response: any) {
    if(response.code == 999){

      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }

  }


  //banderas

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
  }


  Modify(response: any) {
    this.rolDataModify = response
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }


  back() {
    this.tab = true
    this.add = false
    this.modify = false
    this.header = true
    this.rolDataCreate = {}
    this.rolDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
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
