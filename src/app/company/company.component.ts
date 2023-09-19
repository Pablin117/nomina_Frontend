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
    this.CompanyData()
    this.validateSession()

  }

  validateSession(){
    if(this.dataUser != null){
      console.log("activo")
    }else{
      this.router.navigateByUrl("/")
    }
  }
  

  //variables
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  companyDataModify:any = {}
  companyDataCreate:any = {}
  BussinessRules: any = [];
  companyModify: any = {};
  dataUser: any = {}
  url: String = "http://localhost:4042/v1"

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

  RequestCompanyUpdate() {
   
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/bussinesRulesModify", this.companyModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompanyUpdate(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      console.log(response.message)
      alert(response.message)
    }

  }




  //formulario para agregar
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {

      console.log(this.companyDataCreate)
      this.companyDataCreate.userCreation = this.dataUser.user
      
    }
  }


  RequestCompanySave() {
   
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/bussinesRulesModify", this.companyDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompanySave(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }

  }


  //banderas


  Modify(company: any) {
    console.log("modifica")
    this.companyModify = company
    this.add = false
    this.tab = false
    this.modify = true
    this.companyDataModify = {}
    this.companyDataCreate = {}
  }


  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.companyDataModify = {}
    this.companyDataCreate = {}
  }


/*  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    console.log("add")

  }
*/


revoke(){
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
  return this.http.get<any>(this.url + "/revoke/"+ this.dataUser.session, httpOptions).pipe(
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
