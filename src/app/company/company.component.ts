import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {

  constructor(private http: HttpClient, private router: Router) { }

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

  //objects
  companyDataModify: any = {}
  companyDataCreate: any = {}
  companyTemp: any = {}
  BussinessRules: any = []
  dataUser: any = {}
  options: any = {}


  // pagina y url
  url: String = "http://localhost:4042/v1"
  page: String = "company"


  name = 'empresasReport.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  //valida sesiones
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.CompanyData()
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
      this.btnDelete = item.down == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })
  }


  //Obtiene datos de company
  CompanyData() {
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
    this.BussinessRules = response
    console.log("Se obtuvo configuracion de empresa")

  }

  //formulario para modificar
  modForm() {
    let formularioValido: any = document.getElementById("modForm")
    if (formularioValido.reportValidity()) {
      if (this.companyDataModify.passwordAmountSpecialCharacters >= 1) {
        if (this.companyDataModify.passwordAmountNumber >= 1) {
          if (this.companyDataModify.passwordAmountLowercase >= 1) {
            if (this.companyDataModify.passwordAmountUppercase >= 1) {
              this.companyDataModify.userModification = this.dataUser.user
              this.companyDataModify.idCompany = this.companyTemp.idCompany
              console.log(this.companyDataModify)
              this.RequestCompanyUpdate().subscribe(
                (response: any) => this.ResponseCompanyUpdate(response)
              )
            } else {
              alert("La cantidad de caracteres de mayusculas debe ser mayor a 0")
            }
          } else {
            alert("La cantidad de caracteres de minusculas debe ser mayor a 0")
          }
        } else {
          alert("La cantidad de caracteres de números debe ser mayor a 0")
        }
      } else {
        alert("La cantidad de caracteres especiales debe ser mayor a 0")
      }
    }

  }
  RequestCompanyUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateCompany/" + this.companyDataModify.idCompany , this.companyDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseCompanyUpdate(response: any) {
    console.log(response)
    if (response.code == 0) {
      alert(response.message)
      this.companyDataModify = {}
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


//para eliminar

Delete(response:any){
console.log(response.idCompany)
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
  return this.http.delete<any>(this.url + "/deleteCompany/"+response.idCompany, httpOptions).pipe(
    catchError(e => "1")
  )
}

responseDelete(response:any){
  if (response.code == 0) {

    alert(response.message)
    this.back()
    this.ngOnInit()
  } else {
    alert(response.message)
  }
}

  //formulario para agregar 

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
  

      if (this.companyDataCreate.passwordAmountSpecialCharacters >= 1) {
        if (this.companyDataCreate.passwordAmountNumber >= 1) {
          if (this.companyDataCreate.passwordAmountLowercase >= 1) {
            if (this.companyDataCreate.passwordAmountUppercase >= 1) {
              this.companyDataCreate.userCreation = this.dataUser.user
              console.log(this.companyDataCreate)
              this.RequestCompanySave().subscribe(
                (response: any) => this.ResponseCompanySave(response)
              )
            } else {
              alert("La cantidad de caracteres de mayusculas debe ser mayor a 0")
            }
          } else {
            alert("La cantidad de caracteres de minusculas debe ser mayor a 0")
          }
        } else {
          alert("La cantidad de caracteres de números debe ser mayor a 0")
        }
      } else {
        alert("La cantidad de caracteres especiales debe ser mayor a 0")
      }
      
    }
  }
  RequestCompanySave() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createCompany", this.companyDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseCompanySave(response: any) {
    console.log(response)
    if (response.code == 0) {

      alert(response.message)
  
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


  //banderas

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
  }


  Modify(response: any) {
    console.log(response)
    this.companyTemp = response
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }


  back() {
    this.tab = true
    this.add = false
    this.modify = false
    this.header = true
    this.companyDataCreate = {}
    this.companyDataModify = {}
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
