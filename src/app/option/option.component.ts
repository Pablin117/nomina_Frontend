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
    this.optionsValidate()
  }


  //variables
  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  header: boolean = true
  optionDataCreate: any = {}
  optionDataModify: any = {}
  optionData: any = []
  menuData: any = []
  companyData: any = {}
  optionModify: any = {}
  dataUser: any = {}
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false


  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "option"
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

  Modify(option: any) {
    console.log("modifica")
    this.optionModify = option
    console.log(this.optionModify)
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
    console.log("se agrega")
    console.log(this.optionDataCreate)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createOption", this.optionDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseOptionSave(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
     // this.optionModify.name = this.optionDataModify.name
      this.optionModify.userModification = this.dataUser.user
      console.log(this.optionModify)
      this.RequestOptionSaveM().subscribe(
        (response: any) => this.ResponseRoleSaveM(response)
      )
    }
  }
  RequestOptionSaveM() {
    console.log("se agrega")
    console.log(this.optionModify)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyOption", this.optionModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleSaveM(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }

}