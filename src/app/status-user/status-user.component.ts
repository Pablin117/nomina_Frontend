import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-status-user',
  templateUrl: './status-user.component.html',
  styleUrls: ['./status-user.component.css']
})
export class StatusUserComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


  ngOnInit() {

  this.validateSession()
  }


  //variables

  //boolean
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  btnAdd: boolean = false
  btnDelete: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  header: boolean = true

  //objetos
  options: any = {}
  statusUserDataModify: any = {}
  statusUserDataCreate: any = {}
  statusUserData: any = []
  statusUserTemp: any = {}
  dataUser: any = {}

  //url
  pageUrl = "status-user"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  //valida sesiones
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.statusUser()

    } else {
      this.router.navigateByUrl("/")
    }
  }

  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
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
  Modify(company: any) {


    this.statusUserTemp = company
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
  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.statusUserDataCreate = {}
    this.statusUserDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //Obtiene estados de usuario
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
    return this.http.get<any>(this.url.urlData + "/statusUser", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseStatusUser(response: any) {
    this.statusUserData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }


//para eliminar

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
    return this.http.delete<any>(this.url.urlData + "/deleteStatusUser/"+response.idStatusUser, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response:any){
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

      this.statusUserDataModify.idStatusUser = this.statusUserTemp.idStatusUser
      this.statusUserDataModify.userModification = this.dataUser.user


      this.requestStatusUserUpdate().subscribe(
        (response: any) => this.responseStatusUserUpdate(response)
      )
    }
  }

  requestStatusUserUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updateStatusUser/"+ this.statusUserDataModify.idStatusUser, this.statusUserDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseStatusUserUpdate(response: any) {
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
      this.statusUserDataCreate.userCreation = this.dataUser.user

      this.requestStatusUserSave().subscribe(
        (response: any) => this.responseStatusUserSave(response)
      )
    }
  }


  requestStatusUserSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createStatusUser", this.statusUserDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseStatusUserSave(response: any) {
    if (response.code == 0) {

      alert(response.message)
      this.back()
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
    return this.http.get<any>(this.url.urlData + "/revoke/" + this.dataUser.session, httpOptions).pipe(
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
