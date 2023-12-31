import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import { Router } from "@angular/router";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

  constructor(private http: HttpClient,private router: Router, private url:AppComponent) {
  }

  //vars
  userRecover: boolean = true;
  user: String = ""
  messageError: String = ""
  QuestionsData: any = [];
  questionComplete: boolean = false;
  newPassword: string = "";
  confirmPassword: string = "";
  BussinessRules: any ;
  dataUser: any = {}

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.CompanyData()

  }



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
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/user/" + this.user,httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseValidateUserService(response: any) {

    //validación de respuesta
    if (response != null) {
      this.dataUser = response
      this.userRecover = false;
      this.messageError = ""
      this.checkQuestions(response);
    }
    //error in consumption
    else if (response == null || response == "e"){
     alert("Usuario no valido")
    }
  }


  checkQuestions(response:any) {

    this.RequestQuestions(response).subscribe(
      (response: any) => this.ResponseQuestions(response)
    )
  }
  RequestQuestions(response:any) {
    var id = "Administrador"
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData +"/questionsUser/" + response.idUser, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseQuestions(response: any) {

    if (response == null) {

      alert("Usuario no cuenta con preguntas configuradas")
      this.router.navigate(['']);
    } else if(response == 1){
      alert("no hay servicio ")
    }else {
      this.QuestionsData = response;
      this.user = this.QuestionsData[0].idUser;
    for(var x=0;x<this.QuestionsData.length;x++){
      this.QuestionsData[x].respond = ''
    }
    }
  }



  questionsForm() {
    let formularioValido: any = document.getElementById("questionsForm");
    if(formularioValido.reportValidity()){
      this.validateQuestionsService().subscribe(
        (response: any) => this.responseValidateQuestionsService(response)
      )
    }
  }

  validateQuestionsService() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData +"/questionUser/validation" , this.QuestionsData, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseValidateQuestionsService(response: any) {

    if (response.code == "0") {
      this.questionComplete = true
    } else{
      alert(response.message)
    }
  }


  passwordForm(){

  let formularioValido: any = document.getElementById("passwordForm");
    if(formularioValido.reportValidity()){
      if(this.newPassword === this.confirmPassword){
        this.RequestPassword().subscribe(
          (response: any) => this.ResponseValidatePassword(response)
        )
      }else{
        alert("Contraseñas no coinciden")
      }
  }

  }

  RequestPassword(){
    let passwordData = {
      idUser:this.user,
      password:this.newPassword
    }
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData +"/resetPassword" , passwordData, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseValidatePassword(response:any){
    if (response.code == "0") {
      alert(response.message)
      this.router.navigate(['']);
    } else{
      alert(response.message)
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

back(){
  this.router.navigateByUrl("/")
}

}
