import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.RoleData()
  }
  //variables
  RolesData: any = [];
  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  roleDataCreate: any = {}
  roleDataModify: any = {}
  locationsData: any = {};
  companyData: any = {};
  roleModify: any = {};
  dataUser: any = {}

  validateSession(){
    if(this.dataUser != null){
      console.log("activo")
    }else{
      this.router.navigateByUrl("/")
    }
  }




  RoleData() {
    this.RequestRole().subscribe(
      (response: any) => this.ResponseRole(response)
    )
  }

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

  ResponseRole(response: any) {
    this.RolesData = response

    console.log("Se obtuvo roles")

  }

  Modify(rol: any) {
    console.log("modifica")
    this.roleModify = rol


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
    console.log("add")

  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.roleDataModify = {}
    this.roleDataCreate = {}
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.roleDataCreate)
      this.roleDataCreate.userCreation = this.dataUser.user
      this.RequestRoleSave().subscribe(
        (response:any) => this.ResponseRoleSave(response)
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
    return this.http.post<any>(this.url + "/createRol", this.roleDataCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSave(response: any) {
    if(response.code == 0){
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }
  

  }


  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.roleModify.name = this.roleDataModify.name
      this.roleModify.userModification = this.dataUser.user
      this.RequestRoleSaveM().subscribe(
        (response:any) => this.ResponseRoleSaveM(response)
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
    return this.http.put<any>(this.url + "/modifyRol", this.roleModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRoleSaveM(response: any) {
    if(response.code == 0){
      alert(response.message)
      console.log("si")
      this.back()
      this.ngOnInit()
    }else{
      alert(response.message)
    }
  

  }


}
