import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent {
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
  bankData: any = []
  bankDataCreate: any = {}
  bankDataModify: any = {}

  //url
  url: String = "http://localhost:4042/v1"
  pageUrl = "bank"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  ngOnInit() {
    this.validateSession()
  }

  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }


  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.bank()
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
    this.bankDataModify = response
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
    return this.http.delete<any>(this.url + "/deleteBank/"+response.idBank+"/"+this.dataUser.user, httpOptions).pipe(
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

  //obtiene los bancos
  bank() {
    this.requestBank().subscribe(
      (response: any) => this.responseBank(response)
    )

  }
  requestBank() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/bank", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseBank(response: any) {
    this.bankData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  //Agregar bancos
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.bankDataCreate.userCreation = this.dataUser.user
      this.requestBankSave().subscribe(
        (response: any) => this.responseBankSave(response)
      )
    }
  }
  requestBankSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createBank", this.bankDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseBankSave(response: any) {

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
      this.bankDataModify.userModification = this.dataUser.user
      this.requestBankUpdate().subscribe(
        (response: any) => this.responseBankUpdate(response)
      )
    }
  }

  requestBankUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateBank", this.bankDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseBankUpdate(response: any) {
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
    this.bankDataCreate = {}
    this.bankDataModify = {}
    this.bankData = []
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
