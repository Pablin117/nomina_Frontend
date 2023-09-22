import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  //variables
  MenusData: any = []
  url: String = "http://localhost:4042/v1"
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  menuDataCreate: any = {}
  menuDataModify: any = {}
  locationsData: any = {}
  statusData: any = {}
  menuModify: any = {}
  dataUser: any = {}
  VarModulo: any = []
  VarName:any=[]
  header: boolean = true
  Return: any = {}
  file: File | null =null
  file2 : any = {}
  VarId: any = {}
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  VarModule : any = []
  Varlocation: any=[]
  Vargender:any = []


  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.validateSession()
    this.optionsValidate()
    this.Menu()
  }
  constructor(private http: HttpClient,private router: Router) { }

  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "userM"
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


  validateSession(){
    if(this.dataUser != null){
    }else{
      this.router.navigateByUrl("/")
    }
  }

  Menu(){
    this.Module()
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
    return this.http.get<any>(this.url + "/menu", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseMenu(response: any) {
    this.MenusData = response
  }

  Modify(menu: any) {
    this.menuModify = menu
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
    this.menuDataModify = {}
    this.menuDataCreate = {}
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
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.menuDataCreate)
      this.menuDataCreate.userCreation = this.dataUser.user
      this.RequestModuloSave().subscribe(
        (response:any) => this.ResponseModuloSave(response)
      )

    }
  }
  RequestModuloSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createMenu", this.menuDataCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSave(response: any) {
    if(response.code == 0){
      alert(response.message)
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }


  }



  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.menuModify.idModulo = this.menuDataModify.idModulo
      this.menuModify.name = this.menuDataModify.name
      this.menuModify.userModification = this.dataUser.user
      this.RequestUserSaveM().subscribe(
        (response:any) => this.ResponseUserSaveM(response)
      )

    }
  }
  RequestUserSaveM() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyMenu/"+this.menuModify.idMenu, this.menuModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseUserSaveM(response: any) {
    if(response.code == 0){
      alert(response.message)
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }
  }

  revoke() {
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
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

  getModulos(idModule: number): string {
    for (let x = 0; x < this.VarModule.length; x++) {
      if (this.VarModule[x].idModule == idModule) {
        return this.VarModule[x].name
      }
    }
    return '';
  }

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
    return this.http.get<any>(this.url + "/module", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseModule(response: any) {
    this.VarModule = response
  }


}
