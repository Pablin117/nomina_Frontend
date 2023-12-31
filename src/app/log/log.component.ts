import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {

  constructor(private http: HttpClient, private router: Router, private url: AppComponent) { }
  //variables
  logData: any = [];
  dataUser: any = {}

  //boolean
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  modify: boolean = false
  add: boolean = false
  tab: boolean = true

  //url
  pageUrl: string = "log"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  ngOnInit() {
    this.validateSession()
  }

  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.logService();
    } else {
      this.router.navigateByUrl("/")
    }
  }


  //obtiene datos de bitacora
  logService() {
    this.RequestLog().subscribe(
      (response: any) => this.ResponseLog(response)
    )
  }

  RequestLog() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/log", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLog(response: any) {
    this.logData = response;
    this.tamColeccion = response.length
    this.pageSize = 10
  }


  //banderas

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //finaliza la sesion
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
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {

      localStorage.clear()
      this.router.navigateByUrl("/")
    }

  }

}
