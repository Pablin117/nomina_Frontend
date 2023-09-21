import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-status-user',
  templateUrl: './status-user.component.html',
  styleUrls: ['./status-user.component.css']
})
export class StatusUserComponent {

  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.statusUser()
    this.optionsValidate()
  }


  //variables
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  statusUserDataModify: any = {}
  statusUserDataCreate: any = {}
  statusUserData: any = []
  statusUserModify: any = {}
  dataUser: any = {}
  header: boolean = true
  url: String = "http://localhost:4042/v1"

    //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

   
    let page = "status-user"
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


  //banderas
  Modify(company: any) {
    console.log("modifica")
    this.statusUserModify = company
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
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }

  statusUser() {
    this.requestStatusUser().subscribe(
      (response: any) => this.responseStatusUser(response)
    )

  }
  requestStatusUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/statusUser", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseStatusUser(response: any) {
  
    this.statusUserData = response
  }

  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.statusUserModify.userModification = this.dataUser.user

      this.requestStatusUserUpdate().subscribe(
        (response:any) => this.responseStatusUserUpdate(response)
      )
    }
  }

  requestStatusUserUpdate(){
 
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateStatusUser", this.statusUserModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseStatusUserUpdate(response:any){
    if (response.code == 0) {
  
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
      this.statusUserDataCreate.userCreation =this.dataUser.user
      this.requestStatusUserSave().subscribe(
        (response:any) => this.responseStatusUserSave(response)
      )
    }
  }


requestStatusUserSave(){
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.post<any>(this.url + "/createStatusUser", this.statusUserDataCreate, httpOptions).pipe(
    catchError(e => "1")
  )
}
responseStatusUserSave(response:any){
  if (response.code == 0) {

    alert(response.message)
    this.back()
    this.ngOnInit()
  } else {
    alert(response.message)
  }

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
