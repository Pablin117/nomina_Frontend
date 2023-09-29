import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent {
  constructor(private http: HttpClient, private router: Router) { }

  //variables
  //boolean
  header: boolean = true
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  btnAdd: boolean = false
  btnDelete: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false

  //objets
  dataUser: any = {}
  options: any = {} 
  bankData: any = [] 

  //url
  url: String = "http://localhost:4042/v1"
  page = "bank"


  ngOnInit() {
    this.validateSession()
  }

  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.bank()
      this.optionsValidate()
    } else {
      this.router.navigateByUrl("/")
    }
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

  Modify(response: any){

  }

  Add(){

  }

  Delete(response:any){

  }


  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //obtiene los bancos
  bank() {
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
    return this.http.get<any>(this.url + "/bank", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGender(response: any) {
    this.bankData = response
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
