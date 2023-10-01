import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
@Component({
  selector: 'app-payroll-period',
  templateUrl: './payroll-period.component.html',
  styleUrls: ['./payroll-period.component.css']
})
export class PayrollPeriodComponent {


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {


    this.validateSession()

  }

  //variables
  //objeto
  PayrollPeriodsData: any = []
  paryrollPeriodDataCreate: any = {}
  paryrollPeriodDataModify: any = {}
  btnDelete: boolean = false
  dataUser: any = {}
  options: any = {}

  //boolena
  header: boolean = true
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  //url
  url: String = "http://localhost:4042/v1"
  page: string = "payroll-period"




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
      this.btnDelete = item.down == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })

  }

  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.PayrollPeriod()
      this.optionsValidate()
    } else {
      this.router.navigateByUrl("/")
    }
  }


  //obtine modulos
  PayrollPeriod() {
    this.RequestParyrollPeriod().subscribe(
      (response: any) => this.ResponsePayrollPeriod(response)
    )
  }

  RequestParyrollPeriod() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/payrollPeriod", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponsePayrollPeriod(response: any) {
    this.PayrollPeriodsData = response
    console.log(this.PayrollPeriodsData.idPK)
  }
  //banderas
  Modify(modulo: any) {
    console.log("modifica")
    this.paryrollPeriodDataModify = modulo
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false

  }

  backWelcome() {
    this.router.navigateByUrl("/home")
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
    this.paryrollPeriodDataModify = {}
    this.paryrollPeriodDataCreate = {}
    this.ngOnInit()
  }
  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {

      this.paryrollPeriodDataCreate.userCreation = this.dataUser.user
      this.RequestPayrollPeriodSave().subscribe(
        (response: any) => this.ResponseParyrollPeriodSave(response)
      )

    }
  }
  RequestPayrollPeriodSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createPayrollPeriod", this.paryrollPeriodDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseParyrollPeriodSave(response: any) {
    if(response.code == 999){

      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()

    } else {
      alert(response.message)
    }


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
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updatePayrollPeriod", this.paryrollPeriodDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsePayrollPeriodSaveM(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()

    } else {
      alert(response.message)
    }
  }

//para eliminar

  Delete(response:any){
    console.log(response)
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
    return this.http.delete<any>(this.url + "/deletePayrollPeriod/"+response.idModule+"/"+this.dataUser.user, httpOptions).pipe(
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

  //finaliza la sesion
  revoke() {
    console.log("salida")
    console.log(this.dataUser.session)
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
      console.log(response)
      alert(response.message)

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }


}
