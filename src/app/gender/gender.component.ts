import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css']
})
export class GenderComponent {
  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.gender()
    this.optionsValidate()
  }


  //variables
 
  generDataModify: any = {}
  genderDataCreate: any = {}
  genderData: any = []
  genderModify: any = {}
  dataUser: any = {}
  header: boolean = true
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  options: any = {}
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  url: String = "http://localhost:4042/v1"

  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)
    let page = "gender"
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

  //banderas
  Modify(id: any) {
    console.log("modifica")
    this.genderModify = id
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
    console.log("add")
  }
  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }

  gender() {
    this.requestGender().subscribe(
      (response: any) => this.responseGender(response)
    )

  }
  requestGender() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGender(response: any) {

    this.genderData = response
  }

  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.genderModify.userModification = this.dataUser.user

      this.requestGenderUpdate().subscribe(
        (response:any) => this.responseGenderUpdate(response)
      )
    }
  }

  requestGenderUpdate(){

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyGender", this.genderModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGenderUpdate(response:any){
    if (response.code == 0) {
  
      alert(response.message)
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }
  

  //agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.genderDataCreate.userCreation =this.dataUser.user
      this.requestGenderSave().subscribe(
        (response:any) => this.responseGenderSave(response)
      )
    }
  }


requestGenderSave(){
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.post<any>(this.url + "/createGender", this.genderDataCreate, httpOptions).pipe(
    catchError(e => "1")
  )
}
responseGenderSave(response:any){
  if (response.code == 0) {
   
    alert(response.message)
    this.back()
    this.ngOnInit()
  } else {
    alert(response.message)
  }

}

  //cierre de sesion
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
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }
  }



}
