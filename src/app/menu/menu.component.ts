import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }

  ngOnInit() {
    this.validateSession()
  }

  //variables
  MenusData: any = []

  page: string = "menu"
  //boolean
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  btnDelete: boolean = false
  //objectos
  menuDataCreate: any = {}
  menuDataModify: any = {}
  menuModify: any = {}
  dataUser: any = {}
  options: any = {}
  VarModule: any = []



  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.Module()
      this.optionsValidate()
      this.Menu()
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

  //obtine menus
  Menu() {
    this.RequestMenu().subscribe(
      (response: any) => this.ResponseMenu(response)
    )
  }

  RequestMenu() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/menu", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseMenu(response: any) {
    this.MenusData = response
  }



  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.menuDataCreate.userCreation = this.dataUser.user
      this.RequestModuloSave().subscribe(
        (response: any) => this.ResponseModuloSave(response)
      )

    }
  }
  RequestModuloSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createMenu", this.menuDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSave(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()

    } else {
      alert(response.message)
    }


  }


  //actualiza
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.menuDataModify.userModification = this.dataUser.user

      this.RequestMenuM().subscribe(
        (response: any) => this.ResponseMenuM(response)
      )
    }
  }
  RequestMenuM() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updateMenu/" + this.menuDataModify.idMenu, this.menuDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseMenuM(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.back()

    } else {
      alert(response.message)
    }
  }


  //banderas

  backWelcome() {
    this.router.navigateByUrl("/home")
  }
  Modify(response: any) {
    this.menuDataModify = response
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

  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.menuDataModify = {}
    this.menuDataCreate = {}
    this.ngOnInit()
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

  //obtiene el nombre de los modulos
  getModulos(idModule: number): string {
    for (let x = 0; x < this.VarModule.length; x++) {
      if (this.VarModule[x].idModule == idModule) {
        return this.VarModule[x].name
      }
    }
    return '';
  }


  //obtine modulos
  Module() {
    this.requestModule().subscribe(
      (response: any) => this.responseModule(response)
    )
  }

  requestModule() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/module", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseModule(response: any) {
    this.VarModule = response

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
    return this.http.delete<any>(this.url.urlData + "/deleteMenu/"+response.idMenu+"/"+this.dataUser.user, httpOptions).pipe(
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


}
