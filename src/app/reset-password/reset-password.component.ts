import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(private http: HttpClient,  private router: Router, private url:AppComponent) {
  }

  ngOnInit(){
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.validateSession()
  }

  //vars
  data: any = {}
  dataUser: any = {}
  BussinessRules: any

  messageError: String = ""

  validateSession(){
    if(this.dataUser != null){
      this.CompanyData()
    }else{
      this.router.navigateByUrl("/")
    }
  }

  CompanyData(){
    this.RequestCompany().subscribe(
      (response: any) => this.ResponseCompany(response)
    )
  }

  RequestCompany(){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData +"/bussinesRules" , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompany(response:any){
    this.BussinessRules = response[0]
  }

  resetPassword(){
    //validate form
    let formularioValido: any = document.getElementById("loginForm");
    if (formularioValido.reportValidity()) {
      if(this.data.newPassword == this.data.confirmNewPassword){
        //consumption service resert pasword
        this.messageError = ""
        this.data.idUser = this.dataUser.user
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
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/changePassword", this.data, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseResetPasswordService(response: any) {


    if (response != null) {
      //validate code
      if (response.code == 0) {
        alert("Contraseña cambiada exitosamente")
        localStorage.clear()
        this.router.navigateByUrl("/")
      } else if(response.code == 1){
        alert(response.message);
      } else if (response.code == 401) {
        localStorage.clear()
        alert("Te wua sacar")
        this.router.navigateByUrl("/")
      }
      // //error in consumption
      else if (response == null || response == "e") {

      }
    }
  }
}
