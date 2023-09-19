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
    this.CompanyData()

  }

  //variables
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  companyDataModify:any = {}
  companyDataCreate:any = {}
  BussinessRules: any = [];
  dataIndex: any = {};
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
    console.log(this.BussinessRules)
    console.log("Se obtuvo configuracion de empresa")

  }


  modForm() {
    if (this.dataIndex.passwordAmountSpecialCharacters >= 1) {
      if (this.dataIndex.passwordAmountNumber >= 1) {
        if (this.dataIndex.passwordAmountLowercase >= 1) {
          if (this.dataIndex.passwordAmountUppercase >= 1) {
            this.dataIndex.name = this.companyDataModify.name
            this.dataIndex.userModification = this.companyDataModify.user
            console.log(this.dataIndex)
            console.log(this.companyDataModify)
            /*this.RequestCompanyUpdate().subscribe(
              (response: any) => this.ResponseCompanyUpdate(response)
            )*/
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
    return this.http.post<any>(this.url + "/bussinesRulesModify", this.dataIndex, httpOptions).pipe(
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
      alert(response.message)
    }

  }


  Modify(index: any) {
    console.log(index)
    console.log("modifica")
    this.dataIndex = index
    this.add = false
    this.tab = false
    this.modify = true
    this.companyDataModify = {}
    this.companyDataCreate = {}
  }


  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    console.log("add")

  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.companyDataModify = {}
    this.companyDataCreate = {}
  }


  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log("si")
      
    }
  }

}
