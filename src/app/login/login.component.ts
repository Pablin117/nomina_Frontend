import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient,  private router: Router) {
  }

  //vars
  url: String = "http://localhost:4042/v1"
  messageError: String = ""
  data: any = {}
  routes : any = {}

  ngOnInit(){
    //consumption service login
    this.routeService().subscribe(
      (response: any) => this.responseRouteService(response)
    )
  }

  //recover password
  recoverPassword(){
    this.router.navigateByUrl("/recover")
  }

  //login
  login(){
    //validate form
    let formularioValido: any = document.getElementById("loginForm");
    if (formularioValido.reportValidity()) {

      //consumption service login
      this.loginService().subscribe(
        (response: any) => this.responseLoginService(response)
      )
    }
  }

  //consumer service login
  loginService() {
    this.data.idUser = this.data.idUser.toLowerCase()

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/login", this.data, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseLoginService(response: any) {

    if (response != null) {
      //validate code
      if(response.code == 0){
        // login ok
        localStorage.setItem("data", JSON.stringify(response));
        this.router.navigateByUrl("/welcome")
      }
      //code error 1 = failed login, status user, current session
      else if(response.code == 1){
        this.messageError = response.message
      }
      //code error 2 = first login
      else if(response.code == 2){
        localStorage.setItem("data", JSON.stringify(response));
        this.messageError = response.message
        this.router.navigateByUrl("/set-password")
      }
      //code error 3 = required change password
      else if(response.code == 3){
        localStorage.setItem("data",JSON.stringify(response))
        this.router.navigateByUrl("/reset-password")
      }
    }
    //error in consumption
    else if (response == null || response == "e"){
      console.log("No hay comunicación con el servidor!!")

    }
  }

  //consumer service route
  routeService() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/option", httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseRouteService(response: any) {
    if (response != null) {
      //
      this.routes = response

    } else if (response == null || response == "e"){
      console.log("No hay comunicación con el servidor!!")
    }
  }
}
