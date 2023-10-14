import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css']
})
export class GenderComponent {
  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


  ngOnInit() {
    this.validateSession()

  }


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

  //objetos
  genderDataModify: any = {}
  genderDataCreate: any = {}

  genderData: any = []

  dataUser: any = {}
  options: any = {}
  //url
  pageUrl = "gender"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.gender()
      this.optionsValidate()
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
  Modify(response: any) {
    this.genderDataModify = response
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
    this.ngOnInit()
  }
  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //obtiene los generos
  gender() {
    this.requestGender().subscribe(
      (response: any) => this.responseGender(response)
    )

  }
  requestGender() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGender(response: any) {
    this.genderData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  //modificacion
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.genderDataModify.userModification = this.dataUser.user
      this.requestGenderUpdate().subscribe(
        (response: any) => this.responseGenderUpdate(response)
      )
    }
  }

  requestGenderUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updateGender/"+this.genderDataModify.idGender, this.genderDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGenderUpdate(response: any) {
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
    return this.http.delete<any>(this.url.urlData + "/deleteGender/"+response.idGender+"/"+this.dataUser.user, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response:any){
    if(response.code == 999){
      this.revoke()
    } else if (response.code == 0) {
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
      this.genderDataCreate.userCreation = this.dataUser.user
      this.requestGenderSave().subscribe(
        (response: any) => this.responseGenderSave(response)
      )
    }
  }
  requestGenderSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createGender", this.genderDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGenderSave(response: any) {

    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
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
