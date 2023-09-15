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
  locationsData: any = [];
  companyData: any = [];
  dataIndex: any = {};


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

  Modify(index: any) {
    console.log("modifica")
    this.dataIndex = index
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
    }
  }

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.dataIndex.name = this.roleDataModify.name
      console.log(this.roleDataModify)
      console.log(this.dataIndex)
    }
  }



}
