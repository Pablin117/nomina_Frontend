import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent {
  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


  ngOnInit() {
    this.validateSession()
    this.PayrollPeriod()
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
  showSpinner: boolean = false

  //url
  page: string = "payroll"

  //objetos
  personDataModify: any = {}
  personDataCreate: any = {}
  personData: any = []
  dataUser: any = {}


  positionData: any = []
  maritalData: any = []
  employeeData: any = []
  options: any = {}
  locationsData: any = []
  statusEmployeeData: any = []

  PayrollPeriodsData: any = []
  paryrollPeriodDataCreate: any = {}
  paryrollPeriodDataModify: any = {}
  datePayroll: any = {}
  periodo: string = ""


  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }



  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
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
      if (item.page === this.page) {
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

  //banderas
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false


  }

  Modify(id: any) {
    this.personDataModify = id

    this.tab = false
    this.modify = true
    this.header = false

  }
  back() {
    this.modify = false
    this.tab = true

    this.header = true
    this.add = false
    this.personDataCreate = {}
    this.personDataModify = {}
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

  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {

      // this.paryrollPeriodDataCreate.userCreation = this.dataUser.user
      const year = this.periodo.substring(0, 4);
      const month = this.periodo.substring(5, 7);

      const fecha = {
        year: year,
        month: month
      }

      localStorage.setItem("date", JSON.stringify(fecha));
      this.router.navigateByUrl("/payroll-details")
    }
  }


  //obtine periodos
  PayrollPeriod() {
    this.RequestParyrollPeriod().subscribe(
      (response: any) => this.ResponsePayrollPeriod(response)
    )
  }

  RequestParyrollPeriod() {
    return this.http.get<any>(this.url.urlData + "/payrollPeriod").pipe(
      catchError(e => "1")
    )
  }

  ResponsePayrollPeriod(response: any) {
    this.PayrollPeriodsData = response
  }

}
