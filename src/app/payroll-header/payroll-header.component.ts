import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-payroll-header',
  templateUrl: './payroll-header.component.html',
  styleUrls: ['./payroll-header.component.css']
})
export class PayrollHeaderComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


  ngOnInit() {
this.validateSession()
  }


  //variables

  //boolean
  add: boolean = false
  modify: boolean = false
  tab: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false

  //url
  pageUrl: string = "payroll"

  //objetos
  dataUser: any = {}
  options: any = {}
  PayrollHeaderData: any = []

  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }


  //banderas
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false

  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //valida la sesion
  validateSession() {
  
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)

      this.optionsValidate()
      this.PayrollHeader()
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
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })
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


  //obtine periodos
  PayrollHeader() {
    this.RequestParyrollHeader().subscribe(
      (response: any) => this.ResponsePayrollHeader(response)
    )
  }

  RequestParyrollHeader() {
    return this.http.get<any>(this.url.urlData + "/payrollHeader").pipe(
      catchError(e => "1")
    )
  }

  ResponsePayrollHeader(response: any) {
    this.PayrollHeaderData = response
    this.tamColeccion = response.length
    this.pageSize = 10
    
  }


}
