import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-account-bank-employee',
  templateUrl: './account-bank-employee.component.html',
  styleUrls: ['./account-bank-employee.component.css']
})
export class AccountBankEmployeeComponent {
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
  tamColeccion :number = 0
  page = 1;
  pageSize = 0

  //objets
  dataUser: any = {}
  options: any = {} 
  accountBankEmployeeData: any = [] 
  personData:any = []
  bankData:any = []
  accountBankEmployeeDataCreate: any = {}
  accoutnBankEmployeeModify: any = {}

  //url
  url: String = "http://localhost:4042/v1"
  pageUrl = "bank"


  ngOnInit() {
    this.validateSession()
  }

  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.accountBankEmployee()
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
    console.log("modifica")
    this.accoutnBankEmployeeModify = response
    this.accoutnBankEmployeeModify.employeeName = this.getEmployeeName(response.idEmployee)
    this.accoutnBankEmployeeModify.bankName = this.getBankName(response.idBank)
    console.log(response)
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
    return this.http.delete<any>(this.url + "/deleteAccountBankEmployee/"+response.idAccountBank+"/"+this.dataUser.user, httpOptions).pipe(
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

  //obtiene las cuantas bancarias de los empleados
  accountBankEmployee() {
    this.requestAccountBankEmployee().subscribe(
      (response: any) => this.responseAccountBankEmployee(response)
    )

  }
  requestAccountBankEmployee() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/accountBankEmployee", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAccountBankEmployee(response: any) {
    console.log(response)
    this.accountBankEmployeeData = response
    this.tamColeccion = response.length
    this.pageSize = this.tamColeccion/10

    for(let accountBankEmployee of this.accountBankEmployeeData){
      accountBankEmployee.activeName = accountBankEmployee.active == 1 ? 'Activo' : 'Inactivo'
    }

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
    return this.http.get<any>(this.url + "/persons", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseEmployee(response: any) {
    console.log(response)
    this.personData = response

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
    console.log(response)
    this.bankData = response
  }

  //retorna el nombre de persona segun su id 
  getEmployeeName(id: number): string {
    for (let x = 0; x < this.personData.length; x++) {
      if (this.personData[x].idPerson == id) {
        return this.personData[x].name
      }
    }
    return '';
  }

  //retorna el nombre de banoc segun su id 
  getBankName(id: number): string {
    for (let x = 0; x < this.bankData.length; x++) {
      if (this.bankData[x].idBank == id) {
        return this.bankData[x].name
      }
    }
    return '';
  }

  //Agregar account bank employee
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.accountBankEmployeeDataCreate.userCreation = this.dataUser.user
      this.requestAccountBankEmployeeSave().subscribe(
        (response: any) => this.responseAccountBankEmployeeSave(response)
      )
    }
  }
  requestAccountBankEmployeeSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createAccountBankEmployee", this.accountBankEmployeeDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAccountBankEmployeeSave(response: any) {

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
      this.accoutnBankEmployeeModify.userModification = this.dataUser.user
      this.requestAccountBankEmployeeUpdate().subscribe(
        (response: any) => this.responseAccountBankEmployeeUpdate(response)
      )
    }
  }

  requestAccountBankEmployeeUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateAccountBankEmployee", this.accoutnBankEmployeeModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAccountBankEmployeeUpdate(response: any) {
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
    this.accountBankEmployeeDataCreate = {}
    this.accoutnBankEmployeeModify = {}
    this.accountBankEmployeeData = []
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
