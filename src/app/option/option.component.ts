import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }

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
  btnDelete: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false

  //url
  pageUrl = "option"
  page = 1;
  pageSize = 0
  tamColeccion :number = 0

  //objetos
  optionDataCreate: any = {}
  optionDataModify: any = {}
  optionData: any = []
  menuData: any = []
  companyData: any = {}

  dataUser: any = {}
  options: any = {}


  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.option()
      this.optionsValidate()

    } else {
      this.router.navigateByUrl("/")
    }
  }

  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
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
      this.btnDelete = item.down == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })

  }



  //obtine nombre del menu
  getMenuName(idMenu: number): string {
    for (let x = 0; x < this.menuData.length; x++) {
      if (this.menuData[x].idMenu == idMenu) {
        return this.menuData[x].name
      }
    }
    return '';
  }


  //obtine las opciones
  option() {
    this.menu()
    this.requestOption().subscribe(
      (response: any) => this.responseOption(response)
    )
  }

  requestOption() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/option", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseOption(response: any) {
    this.optionData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }
  //obtine los menus
  menu() {
    this.requestMenu().subscribe(
      (response: any) => this.responseMenu(response)
    )
  }

  requestMenu() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/menu", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseMenu(response: any) {
    this.menuData = response
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
    return this.http.get<any>(this.url.urlData + "/revoke/" + this.dataUser.session, httpOptions).pipe(
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

  Modify(response: any) {
    this.optionDataModify = response
    this.header = false
    this.add = false
    this.tab = false
    this.modify = true

  }

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }

  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.optionDataCreate = {}
    this.optionDataModify = {}
    this.ngOnInit()
  }


  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.optionDataCreate.userCreation = this.dataUser.user
      this.RequestOptionSave().subscribe(
        (response: any) => this.ResponseOptionSave(response)
      )

    }
  }
  RequestOptionSave() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createOption", this.optionDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseOptionSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {

      this.optionDataModify.idOption = this.optionDataModify.idOption
      this.optionDataModify.idMenu = this.optionDataModify.idMenu
      this.optionDataModify.userModification = this.dataUser.user




       this.RequestOptionSaveM().subscribe(
          (response: any) => this.ResponseRoleSaveM(response)
        )
    }
  }
  RequestOptionSaveM() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updateOption/"+this.optionDataModify.idOption, this.optionDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleSaveM(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }


  //para eliminar

  Delete(response: any) {

    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }

  requestDelete(response: any) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<any>(this.url.urlData + "/deleteOption/" + response.idOption, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {
    if (response.code == 0) {

      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }




}
