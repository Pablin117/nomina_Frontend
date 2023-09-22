import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {coerceStringArray} from "@angular/cdk/coercion";

@Component({
  selector: 'app-role-option',
  templateUrl: './role-option.component.html',
  styleUrls: ['./role-option.component.css']
})
export class RoleOptionComponent {

  constructor(private http: HttpClient, private router: Router) { }

  //vars
  url: String = "http://localhost:4042/v1"
  header:boolean = true
  tab:boolean = true
  add : boolean = false
  modify : boolean = false
  dataUser: any = {}
  RolesData: any = []
  OptionsData: any = []
  RolesOptionsData:any = []
  RoleOptionCreate: any = {}
  RoleOptionModify: any = {}
  Permisos:any = []

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.permisos()
    this.Options()

    this.RoleOptionCreate.idPK = {}
  }

  permisos(){
    this.Permisos.push({
      id: 1,
      name: "Habilitado"
    })
    this.Permisos.push({
      id: 0,
      name: "Deshabilitado"
    })

   console.log(this.Permisos)
  }

  Options(){
    this.RequestRole().subscribe(
      (response: any) => this.ResponseRequestRole(response)
    )
  }

  Add(){
    this.tab = false
    this.add = true
    this.modify = false
    this.header = false
  }

  back(){
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

      console.log(this.RoleOptionCreate)
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
    return this.http.post<any>(this.url + "/createRoleOption", this.RoleOptionCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleOptionSave(response: any) {
    console.log(response)

    if (response.code == 1){
      alert(response.message)
    } else if(response.code == 0){
      alert(response.message)
      this.back()
    }
  }


  //Modificacion
  Modify(optRole : any){
    this.RoleOptionModify = optRole
    this.modify = true
    this.add = false
    this.tab = false
    this.header = false

  }

  modifyForm(){
    let formularioValido: any = document.getElementById("modifyForm");
    if (formularioValido.reportValidity()) {
      this.RoleOptionModify.userModification = this.dataUser.user

      console.log(this.RoleOptionModify)
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
    return this.http.put<any>(this.url + "/modifyRoleOption", this.RoleOptionModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRoleOptionModify(response: any) {
    console.log(response)

    if (response.code == 1){
      alert(response.message)
    } else if(response.code == 0){
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
    console.log(this.RolesData)

    this.RequestOptions().subscribe(
      (response: any) => this.ResponseRequestOptions(response)
    )
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
    console.log(this.OptionsData)

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
    console.log(this.RolesOptionsData)

    this.assignNames()
  }

  assignNames(){
    for(var optionAvalile of this.RolesOptionsData){
      for(var role of this.RolesData){
        if(role.idRole == optionAvalile.idPK.idRole){
          optionAvalile.idPK.nameRole = role.name
        }
      }
      for(var option of this.OptionsData){
        if(option.idOption == optionAvalile.idPK.idOption){
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

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


}