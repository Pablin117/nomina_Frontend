import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-module-maintenance',
  templateUrl: './module-maintenance.component.html',
  styleUrls: ['./module-maintenance.component.css']
})
export class ModuleMaintenanceComponent {
  //variables
  ModulosData: any = [];
  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  moduloDataCreate: any = {}
  moduloDataModify: any = {}
  locationsData: any = {};
  companyData: any = {};
  moduloModify: any = {};
  dataUser: any = {}
  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.ModuloData()
  }
  constructor(private http: HttpClient) { }


  ModuloData() {
    this.RequestRModulo().subscribe(
      (response: any) => this.ResponseModulo(response)
    )
  }

  RequestRModulo() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/module", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseModulo(response: any) {
    this.ModulosData = response

    console.log("Se obtuvo roles")
  }

  Modify(modulo: any) {
    console.log("modifica")
    this.moduloModify = modulo


    this.add = false
    this.tab = false
    this.modify = true
    this.moduloDataModify = {}
    this.moduloDataCreate = {}
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
    this.moduloDataModify = {}
    this.moduloDataCreate = {}
  }

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      console.log(this.moduloDataCreate)
      this.moduloDataCreate.userCreation = this.dataUser.user
      this.RequestModuloSave().subscribe(
        (response:any) => this.ResponseModuloSave(response)
      )

    }
  }
  RequestModuloSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createModulo", this.moduloDataCreate,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSave(response: any) {
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
      this.moduloModify.name = this.moduloDataModify.name
      this.moduloModify.userModification = this.dataUser.user
      this.RequestModuloSaveM().subscribe(
        (response:any) => this.ResponseModuloSaveM(response)
      )

    }
  }
  RequestModuloSaveM() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyModule/"+this.moduloModify.idModule, this.moduloModify,httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseModuloSaveM(response: any) {
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
