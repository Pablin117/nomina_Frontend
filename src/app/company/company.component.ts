import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)

    this.optionsValidate()
    this.CompanyData()
    this.validateSession()

  }
  //variables
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  companyDataModify: any = {}
  companyDataCreate: any = {}
  BussinessRules: any = []
  companyModify: any = {}
  dataUser: any = {}
  header: boolean = true
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  url: String = "http://localhost:4042/v1"


  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "company"
    let permisos: any = {}

    this.options.forEach((item: any) => {
      if (item.page === page) {
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




  validateSession() {
    if (this.dataUser != null) {
      console.log("activo")
    } else {
      this.router.navigateByUrl("/")
    }
  }


  
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
    if (this.companyModify.passwordAmountSpecialCharacters >= 1) {
      if (this.companyModify.passwordAmountNumber >= 1) {
        if (this.companyModify.passwordAmountLowercase >= 1) {
          if (this.companyModify.passwordAmountUppercase >= 1) {
            this.companyModify.userModification = this.dataUser.user
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

  RequestCompanyUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updateCompany", this.companyModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompanyUpdate(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


  //formulario para agregar por si se necesita

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {


      if (this.companyDataCreate.passwordAmountSpecialCharacters >= 1) {
        if (this.companyDataCreate.passwordAmountNumber >= 1) {
          if (this.companyDataCreate.passwordAmountLowercase >= 1) {
            if (this.companyDataCreate.passwordAmountUppercase >= 1) {
              this.companyDataCreate.userCreation = this.dataUser.user
            
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
    console.log("add")

  }


  Modify(company: any) {
    console.log("modifica")
    this.companyModify = company
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }


  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
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
