import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']

})
export class ResetPasswordComponent {

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.CompanyData()
    this.checkQuestions()
  }

  //variables
  QuestionsData: any = [];
  user: String = "";
  questionComplete: boolean = false;
  newPassword: string = "";
  confirmPassword: string = "";
  BussinessRules: any ;
  url: String = "http://localhost:4042/v1"
 
 

  checkQuestions() {
    this.RequestQuestions().subscribe(
      (response: any) => this.ResponseQuestions(response)
    )
  }
  RequestQuestions() {
    var id = "Administrador"
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url+"/questionsUser/" + id, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseQuestions(response: any) {
    if (response == null) {
      alert("Error")
    } else {
      this.QuestionsData = response;
      this.user = this.QuestionsData[0].idUser;
      console.log("se obtuvo data de preguntas")
    for(var x=0;x<this.QuestionsData.length;x++){
      this.QuestionsData[x].respond = ''
    }
    }
  }



  formQuestions() {
    this.validateQuestionsService().subscribe(
      (response: any) => this.responseValidateQuestionsService(response)
    )
  }
  validateQuestionsService() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url+"/questionUser/validation" , this.QuestionsData, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseValidateQuestionsService(response: any) {
    console.log(response)
    if (response.code == "0") { 
      this.questionComplete = true   
    } else{
      alert(response.message)
    }
  }


  formPassword(){
    if(this.newPassword === this.confirmPassword){
      this.RequestPassword().subscribe(
        (response: any) => this.ResponseValidatePassword(response)
      )
    }else{
      alert("Contraseñas no coinciden")
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
    return this.http.post<any>(this.url+"/resetPassword" , passwordData, httpOptions).pipe(
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
    return this.http.get<any>(this.url+"/bussinesRules" , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompany(response:any){
  this.BussinessRules = response[0]
  console.log("Se obtuvo configuracion de empresa")
  }

}