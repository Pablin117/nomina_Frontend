import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(private http: HttpClient,  private router: Router) {
  }

  ngOnInit(){
    this.DataUser()
  }

  //vars
  url: String = "http://localhost:4042/v1"
  data: any = {}
  dataUser: any = {}
  user: any = {}
  messageError: String = ""

  DataUser() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.user = this.dataUser.user
  }

  resetPassword(){
    //validate form
    let formularioValido: any = document.getElementById("loginForm");
    if (formularioValido.reportValidity()) {
      if(this.data.newPassword == this.data.confirmNewPassword){
        //consumption service resert pasword
        this.messageError = ""
        this.data.idUser = this.user
        this.resetPasswordService().subscribe(
          (response: any) => this.responseResetPasswordService(response)
        )
      }else{
        this.messageError = "Las contraseñas no coinciden"
      }
    }
  }

  //consumer service login
  resetPasswordService() {
    console.log(this.data)
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/changePassword", this.data, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseResetPasswordService(response: any) {

    console.log(response)

    if (response != null) {
      //validate code
      if (response.code == 0) {
        alert("Contraseña cambiada exitosamente");
        this.router.navigateByUrl("/");
      }
      // //error in consumption
      else if (response == null || response == "e") {
        console.log("No hay comunicación con el servidor!!")

      }
    }
  }
}
