import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.option()
    this.validateSession()
  }


  //variables


  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  header: boolean = true
  roleDataCreate: any = {}
  roleDataModify: any = {}
  optionData: any = []
  menuData: any = []
  companyData: any = {}
  roleModify: any = {}
  dataUser: any = {}

  getMenuName(idMenu: number): string {
    for (let x = 0; x < this.menuData.length; x++) {
      if (this.menuData[x].idMenu == idMenu) {
        return this.menuData[x].name
      }
    }
    return '';
  }



  validateSession() {
    if (this.dataUser != null) {
      console.log("activo")
    } else {
      this.router.navigateByUrl("/")
    }
  }

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
    return this.http.get<any>(this.url + "/option", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseOption(response: any) {

    this.optionData = response
    console.log(this.optionData)

  }

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
    return this.http.get<any>(this.url + "/menu", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseMenu(response: any) {

    this.menuData = response
    console.log(this.menuData)
  }

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

  Modify(rol: any) {
    console.log("modifica")
    this.roleModify = rol
    this.header = false
    this.add = false
    this.tab = false
    this.modify = true
    this.roleDataModify = {}
    this.roleDataCreate = {}
  }

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    console.log("add")

  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }
  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.roleDataModify = {}
    this.roleDataCreate = {}
  }


  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.roleDataCreate)
      this.roleDataCreate.userCreation = this.dataUser.user
      this.RequestRoleSave().subscribe(
        (response: any) => this.ResponseRoleSave(response)
      )

    }
  }
  RequestRoleSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createRol", this.roleDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }


  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.roleModify.name = this.roleDataModify.name
      this.roleModify.userModification = this.dataUser.user
      this.RequestRoleSaveM().subscribe(
        (response: any) => this.ResponseRoleSaveM(response)
      )

    }
  }
  RequestRoleSaveM() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyRol", this.roleModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSaveM(response: any) {
    if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }


  }

}
