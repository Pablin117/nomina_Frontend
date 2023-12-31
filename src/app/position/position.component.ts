import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent {
  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


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
  pageUrl: string = "position"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0
  //objetos
  positionDataModify: any = {}
  positionDataCreate: any = {}
  positionData: any = []
  dataUser: any = {}
  selectedDepartment: any = []
  userData: any = []
  departmentData: any = []
  options: any = {}

  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.position()


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
  Modify(id: any) {
    this.positionDataModify = id
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
    this.positionDataCreate = {}
    this.positionDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }



  //obtiene puestos
  position() {
    this.requestPosition().subscribe(
      (response: any) => this.responsePosition(response)
    )

  }
  requestPosition() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/positions", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePosition(response: any) {
    this.positionData = response
    this.department()
    this.tamColeccion = response.length
    this.pageSize = 10
  }


  //obtiene departamentos
  department() {
    this.requestDepartment().subscribe(
      (response: any) => this.responseDepartment(response)
    )

  }
  requestDepartment() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/department", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseDepartment(response: any) {
    this.departmentData = response
    //  this.position()


  }

  getDepartmentName(idDepartment: number): string {
    for (let x = 0; x < this.departmentData.length; x++) {
      if (this.departmentData[x].idDepartment == idDepartment) {
        return this.departmentData[x].name
      }
    }
    return '';
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
    return this.http.delete<any>(this.url.urlData + "/deletePosition/" + response.idPosition + "/" + this.dataUser.user, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {
    if (response.code == 999) {

      this.revoke()
    } else if (response.code == 0) {
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
      this.positionDataModify.userModification = this.dataUser.user
      this.positionDataModify = this.positionDataModify
      this.requestPositionUpdate().subscribe(
        (response: any) => this.responsePositionUpdate(response)
      )
    }
  }

  requestPositionUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updatePosition/" + this.positionDataModify.idPosition, this.positionDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePositionUpdate(response: any) {
    if (response.code == 999) {
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
      this.positionDataCreate.userCreation = this.dataUser.user

      this.RequestPositionSave().subscribe(
        (response: any) => this.ResponsePositionSave(response)
      )
    }
  }

  RequestPositionSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createPosition", this.positionDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsePositionSave(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
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
