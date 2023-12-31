import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css']
})
export class AbsenceComponent {
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
  pageUrl: string = "absence"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0
  //objetos
  absenceDataModify: any = {}
  absenceDataCreate: any = {}
  absenceData: any = []
  dataUser: any = {}
  selectedEmployee: any = []
  userData: any = []
  employeeData: any = []
  options: any = {}


  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.absence()


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
    this.absenceDataModify = id
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
    this.absenceDataCreate = {}
    this.absenceDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }



  //obtiene Inasistencias
  absence() {
    this.requestAbsence().subscribe(
      (response: any) => this.responseAbsence(response)
    )

  }
  requestAbsence() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/absences", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAbsence(response: any) {
    this.absenceData = response
    this.employee()
    this.tamColeccion = response.length
    this.pageSize = 10
  }


    //obtiene persona
    employee() {
      this.requestEmployee().subscribe(
        (response: any) => this.responseEmployee(response)
      )

    }
    requestEmployee() {
      var httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      return this.http.get<any>(this.url.urlData + "/persons", httpOptions).pipe(
        catchError(e => "1")
      )
    }
    responseEmployee(response: any) {
      this.employeeData = response
    }

    getEmployeeName(idPerson: number): string {
      for (let x = 0; x < this.employeeData.length; x++) {
        if (this.employeeData[x].idPerson == idPerson) {
          return this.employeeData[x].name + " " + this.employeeData[x].lastname
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
    return this.http.delete<any>(this.url.urlData + "/deleteAbsence/" + response.idAbsence + "/" + this.dataUser.user, httpOptions).pipe(
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

  /* modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.absenceDataModify.userModification = this.dataUser.user
      this.absenceDataModify = this.absenceDataModify
      this.requestAbsenceUpdate().subscribe(
        (response: any) => this.responseAbsenceUpdate(response)
      )
    }
  }

  requestAbsenceUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updateAbsence/" + this.absenceDataModify.idAbsence, this.absenceDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAbsenceUpdate(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  } */


  //agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.absenceDataCreate.userCreation = this.dataUser.user

      this.requestAbsenceSave().subscribe(
        (response: any) => this.responseAbsenceSave(response)
      )
    }
  }

  requestAbsenceSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createAbsence", this.absenceDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )


  }
  responseAbsenceSave(response: any) {
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
