import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-status-employee',
  templateUrl: './status-employee.component.html',
  styleUrls: ['./status-employee.component.css']
})
export class StatusEmployeeComponent {
  constructor(private http: HttpClient, private router: Router) { }

  //variables
  //boolean
  header: boolean = true
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  btnAdd: boolean = false
  btnDelete: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false

  //objets
  dataUser: any = {}
  options: any = {} 
  statusEmployeeData: any = [] 
  statusEmployeeDataCreate: any = {}
  statusEmployeeDataModify: any = {}

  //url
  url: String = "http://localhost:4042/v1"
  pageUrl = "bank"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  ngOnInit() {
    this.validateSession()
  }

  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.statusEmployee()
      this.optionsValidate()
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

  Modify(response: any) {
    console.log("modifica")
    this.statusEmployeeDataModify = response
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
    
  }

  Delete(response:any){
    
    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }

  requestDelete(response:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<any>(this.url + "/deleteStatusEmployee/"+response.idStatusEmployee+"/"+this.dataUser.user, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response:any){
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {

      alert(response.message)
      this.back()

    } else {
      alert(response.message)
    }
  }


  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //obtiene los status-employee
  statusEmployee() {
    this.requestStatusEmployee().subscribe(
      (response: any) => this.responseStatusEmployee(response)
    )
  }
  
  requestStatusEmployee() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/statusEmployee", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseStatusEmployee(response: any) {
    this.statusEmployeeData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  //Agregar status empleado
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.statusEmployeeDataCreate.userCreation = this.dataUser.user
      this.requestStatusEmployeeSave().subscribe(
        (response: any) => this.responseStatusEmployeeSave(response)
      )
    }
  }

  requestStatusEmployeeSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createStatusEmployee", this.statusEmployeeDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseStatusEmployeeSave(response: any) {

    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
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
      this.statusEmployeeDataModify.userModification = this.dataUser.user
      this.requestStatusEmployeeUpdate().subscribe(
        (response: any) => this.responseStatusEmployeeUpdate(response)
      )
    }
  }

  requestStatusEmployeeUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateStatusEmployee", this.statusEmployeeDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseStatusEmployeeUpdate(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }

  back() {
    this.statusEmployeeDataCreate = {}
    this.statusEmployeeDataModify = {}
    this.statusEmployeeData = []
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.ngOnInit()
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
