import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrls: ['./payroll-details.component.css']
})
export class PayrollDetailsComponent {
  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.validateSession()

  }

  //variables

  //boolean
  add: boolean = false
  modify: boolean = false
  tab: boolean = false
  header: boolean = false


  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  showSpinner: boolean = true

  //url
  pageUrl: string = "payroll"
  url: String = "http://localhost:4042/v1"
  page = 1;
  pageSize = 0
  tamColeccion :number = 0

  //objetos
  personDataModify: any = {}
  personDataCreate: any = {}
  personData: any = []
  dataUser: any = {}
  datePayroll: any = {}
  payrollData: any = []

  positionData: any = []
  maritalData: any = []
  employeeData: any = []
  options: any = {}
  locationsData: any = []
  statusEmployeeData: any = []

  PayrollPeriodsData: any = []
  paryrollPeriodDataCreate: any = {}
  paryrollPeriodDataModify: any = {}
  periodo: string = ""




  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.initPlanilla()

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

  //banderas
  Add() {
    this.modify = false
    this.add = true
    this.tab = false

    console.log("add")
  }

  Modify(id: any) {
    console.log("modifica")
    this.personDataModify = id
    this.tab = false
    this.modify = true


  }
  back() {
    this.router.navigateByUrl("/payroll")
  }
  backWelcome() {
    this.router.navigateByUrl("/payroll")
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

  //agrega
  initPlanilla() {

    this.datePayroll = localStorage.getItem("date")

    if(this.datePayroll != null){
      this.datePayroll = JSON.parse(this.datePayroll)
      console.log(this.datePayroll.year);
      
      this.generatePayroll(this.datePayroll.year, this.datePayroll.month)
    }
   

  }


  //obtiene planilla
  generatePayroll(year: any, month: any) {

    let yearN:number = year
    let monthN:number = month
    this.requestPlanilla(yearN, monthN).subscribe(
      (response: any) => this.responsePlanilla(response)
    )
  }
  requestPlanilla(year: any, month: any) {
    const admin = this.dataUser.user
    this.persons()
    return this.http.get<any>(this.url + "/PayrollCalc/" + year + "/" + month + "/" + admin).pipe(
      catchError(e => "1")
    )
  }
  responsePlanilla(response: any) {
    console.log(response);
    
    this.payrollData = response
    this.showSpinner = false
    this.tab = true
    this.header= true
    this.tamColeccion = response.length
    this.pageSize = 10

  }




  //modifica
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.paryrollPeriodDataModify.userModification = this.dataUser.user
      this.RequestPayrollPeriodSaveM().subscribe(
        (response: any) => this.ResponsePayrollPeriodSaveM(response)
      )

    }
  }
  RequestPayrollPeriodSaveM() {
    console.log("se agrega")

    return this.http.put<any>(this.url + "/updatePayrollPeriod", this.paryrollPeriodDataModify).pipe(
      catchError(e => "1")
    )
  }
  ResponsePayrollPeriodSaveM(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }





  //obtiene empleado
  persons() {
    this.requestPersons().subscribe(
      (response: any) => this.responsePersons(response)
    )

  }
  requestPersons() {

    return this.http.get<any>(this.url + "/persons").pipe(
      catchError(e => "1")
    )
  }
  responsePersons(response: any) {
    this.employeeData = response
    console.log(response);
    
    this.statusEmployeeService()
  }

  getEmployeeName(idPerson: number): string {
    for (let x = 0; x < this.employeeData.length; x++) {
      if (this.employeeData[x].idPerson == idPerson) {
        return this.employeeData[x].name
      }
    }
    return '';
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
    return this.http.get<any>(this.url + "/positions", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePosition(response: any) {
    this.positionData = response
  }
  getPositionName(idPosition: number): string {
    for (let x = 0; x < this.positionData.length; x++) {
      if (this.positionData[x].idPosition == idPosition) {
        return this.positionData[x].name
      }
    }
    return '';
  }


  //Obtiene datos de status empleados
  statusEmployeeService() {
    this.RequestStatusEmployee().subscribe(
      (response: any) => this.ResponseStatusEmployee(response)
    )
  }
  RequestStatusEmployee() {
    return this.http.get<any>(this.url + "/statusEmployee").pipe(catchError(e => "1"))
  }
  ResponseStatusEmployee(response: any) {
    this.statusEmployeeData = response
    this.position()
  }
  getStatusEmployeeName(idStatusEmployee: number): string {
    for (let x = 0; x < this.statusEmployeeData.length; x++) {
      if (this.statusEmployeeData[x].idStatusEmployee == idStatusEmployee) {
        return this.statusEmployeeData[x].name
      }
    }
    return '';
  }





}
