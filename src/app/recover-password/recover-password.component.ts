import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

  constructor(private http: HttpClient) {
  }

  //vars
  url: String = "http://localhost:4042/v1"
  userRecover: boolean = true
  user: String = ""
  messageError: String = ""

  recover(){
    //validate form
    let formularioValido: any = document.getElementById("recoverForm");
    if (formularioValido.reportValidity()) {

      //consumption service login
      this.validateUserService().subscribe(
        (response: any) => this.responseValidateUserService(response)
      )
    }
  }

  //consumer service login
  validateUserService() {
    this.user = this.user.toLowerCase()
    console.log(this.user)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/user/" + this.user,httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseValidateUserService(response: any) {
    console.log(response) //<----- Acá esta la info recuperada del usuairo
    //validación de respuesta
    if (response != null) {
      this.userRecover = false;
      this.messageError = ""
    }
    //error in consumption
    else if (response == null || response == "e"){
      this.messageError = "Usuario no valido"
    }
  }




}
