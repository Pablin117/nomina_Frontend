import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { AppComponent } from "../app.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.checkQuestions()
  }

  //variables
  QuestionsData: any = [];
  user: String = "";
  questionComplete: boolean = false;
  newPassword: string = "";
  confirmPassword: string = "";
 
 

  checkQuestions() {
    this.questionsService().subscribe(
      (response: any) => this.responseQuestionsService(response)
    )
  }
  questionsService() {
    var id = "Administrador"
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/questionsUser/" + id, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseQuestionsService(response: any) {
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
    return this.http.post<any>("http://localhost:4042/v1/questionUser/validation" , this.QuestionsData, httpOptions).pipe(
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
      this.validatePassword().subscribe(
        (response: any) => this.responseValidatePassword(response)
      )
    }else{
      alert("Contraseñas no coinciden")
    }
  }

  validatePassword(){
    let passwordData = {
      idUser:this.user,
      password:this.newPassword
    }
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>("http://localhost:4042/v1/resetPassword" , passwordData, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseValidatePassword(response:any){
    if (response.code == "0") { 
      alert(response.message)
      this.router.navigate(['']);
    } else{
      alert(response.message)
    }
  }



}