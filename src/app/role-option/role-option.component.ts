import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { coerceStringArray } from "@angular/cdk/coercion";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-role-option',
  templateUrl: './role-option.component.html',
  styleUrls: ['./role-option.component.css']
})
export class RoleOptionComponent {

  constructor(private http: HttpClient, private router: Router) { }

  //variables

  //url
  url: String = "http://localhost:4042/v1"

  //boolean
  header: boolean = true
  tab: boolean = true
  add: boolean = false
  modify: boolean = false
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  btnDelete: boolean = false
  //objetos
  dataUser: any = {}
  RolesData: any = []
  OptionsData: any = []
  RolesOptionsData: any = []
  RoleOptionCreate: any = {}
  RoleOptionModify: any = {}
  Permisos: any = []
  options: any = {}
  pageUrl: string = "role-option"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  name = 'RolOpcionesReport.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  ngOnInit() {
    this.validateSession()
    this.RoleOptionCreate.idPK = {}

  }

  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.permisos()
      this.Options()

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



  permisos() {
    this.Permisos.push({
      id: 1,
      name: "Habilitado"
    })
    this.Permisos.push({
      id: 0,
      name: "Deshabilitado"
    })
  }

  Options() {
    this.RequestRole().subscribe(
      (response: any) => this.ResponseRequestRole(response)
    )
  }

  Add() {
    this.tab = false
    this.add = true
    this.modify = false
    this.header = false
  }

  back() {
    this.tab = true
    this.add = false
    this.modify = false
    this.header = true
    this.RoleOptionCreate = {}
    this.RoleOptionModify = {}
    this.Permisos = []
    this.ngOnInit()
  }

  //Alta
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.RoleOptionCreate.userCreation = this.dataUser.user

      this.RequestRoleOptionSave().subscribe(
        (response: any) => this.ResponseRoleOptionSave(response)
      )
    }
  }

  RequestRoleOptionSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createRoleOption", this.RoleOptionCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleOptionSave(response: any) {

    if (response.code == 1) {
      alert(response.message)
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    }

  }


  //Modificacion
  Modify(optRole: any) {
    this.RoleOptionModify = optRole
    this.modify = true
    this.add = false
    this.tab = false
    this.header = false

  }

  modifyForm() {
    let formularioValido: any = document.getElementById("modifyForm");
    if (formularioValido.reportValidity()) {
      this.RoleOptionModify.userModification = this.dataUser.user

      this.RequestRoleOptionModify().subscribe(
        (response: any) => this.ResponseRoleOptionModify(response)
      )
    }
  }

  RequestRoleOptionModify() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyRoleOption", this.RoleOptionModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleOptionModify(response: any) {

    if (response.code == 1) {
      alert(response.message)
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    }
  }

  //Consultas
  RequestRole() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/role", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRequestRole(response: any) {
    this.RolesData = response

    this.RequestOptions().subscribe(
      (response: any) => this.ResponseRequestOptions(response)
    )
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  RequestOptions() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/option", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRequestOptions(response: any) {
    this.OptionsData = response

    this.RequestRoleOptions().subscribe(
      (response: any) => this.ResponseRequestRoleOptions(response)
    )
  }

  RequestRoleOptions() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/roleOption", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRequestRoleOptions(response: any) {
    this.RolesOptionsData = response

    this.assignNames()
  }

  assignNames() {
    for (var optionAvalile of this.RolesOptionsData) {
      for (var role of this.RolesData) {
        if (role.idRole == optionAvalile.idPK.idRole) {
          optionAvalile.idPK.nameRole = role.name
        }
      }
      for (var option of this.OptionsData) {
        if (option.idOption == optionAvalile.idPK.idOption) {
          optionAvalile.idPK.nameOption = option.name
        }
      }
      optionAvalile.nameUp = optionAvalile.up == 1 ? "Habilitado" : "Deshabilitado"
      optionAvalile.nameDown = optionAvalile.down == 1 ? "Habilitado" : "Deshabilitado"
      optionAvalile.nameUpdate = optionAvalile.update == 1 ? "Habilitado" : "Deshabilitado"
      optionAvalile.namePrint = optionAvalile.print == 1 ? "Habilitado" : "Deshabilitado"
      optionAvalile.nameExport = optionAvalile.export == 1 ? "Habilitado" : "Deshabilitado"
    }
  }


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
      return this.http.delete<any>(this.url + "/deleteRoleOption/"+response.idPK.idRole + "/" + response.idPK.idOption, httpOptions).pipe(
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


  //finaliza sesion
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

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


}
