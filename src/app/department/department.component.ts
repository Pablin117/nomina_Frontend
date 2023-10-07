import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent {
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {


    this.validateSession()

  }
  //variables
  //objeto
  companyData: any = []
  DepartmentsData: any = []
  departmentDataCreate: any = {}
  departmentDataModify: any = {}
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
  pageUrl: string = "department"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

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

  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.CompanyService()
      this.Department()
      this.optionsValidate()
    } else {
      this.router.navigateByUrl("/")
    }
  }

  Department() {
    this.RequestDepartment().subscribe(
      (response: any) => this.ResponseDepartment(response)
    )
  }

  RequestDepartment() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/department", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseDepartment(response: any) {
    this.DepartmentsData = response
  }
  //banderas
  Modify(department: any) {
    this.departmentDataModify = department
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
  }

  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.departmentDataModify = {}
    this.departmentDataCreate = {}
    this.ngOnInit()
  }
  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {

      this.departmentDataCreate.userCreation = this.dataUser.user
      this.RequestDepartmentSave().subscribe(
        (response: any) => this.ResponseDepartmentSave(response)
      )

    }
  }
  RequestDepartmentSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createDepartment", this.departmentDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseDepartmentSave(response: any) {
    if(response.code == 999){

      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()

    } else {
      alert(response.message)
    }


  }

  //modifica
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.departmentDataModify.userModification = this.dataUser.user
      this.RequestDepartmentSaveM().subscribe(
        (response: any) => this.ResponseDepartmentSaveM(response)
      )

    }
  }
  RequestDepartmentSaveM() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateDepartment/" + this.departmentDataModify.idDepartment, this.departmentDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseDepartmentSaveM(response: any) {
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
    return this.http.delete<any>(this.url + "/deleteDepartment/"+response.idDepartment+"/"+this.dataUser.user, httpOptions).pipe(
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

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }

  //obtiene la empresa
  CompanyService() {
    this.RequestCompany().subscribe(
      (response: any) => this.ResponseCompany(response)
    )
  }
  RequestCompany() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/bussinesRules", httpOptions).pipe(
      catchError(e => "1")
    )
  }


  ResponseCompany(response: any) {
    this.companyData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  //retorna el nombre de la compañia con el id company
  getCompanyName(idCompany: number): string {
    for (let x = 0; x < this.companyData.length; x++) {
      if (this.companyData[x].idCompany == idCompany) {
        return this.companyData[x].name
      }
    }
    return '';
  }
}
