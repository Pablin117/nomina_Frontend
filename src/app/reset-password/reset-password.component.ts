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
    this.DataUser()
   
  }

  //variables
  QuestionsData: any = [];
  user: string = "";
  questionComplete: boolean = false;
  question: string = "";
  response: string= "";
  newPassword: string = "";
  confirmPassword: string = "";
  BussinessRules: any ;
  dataUser: any ={}
  url: string = "http://localhost:4042/v1"
  createQuestion={
    idUser: "",
    questions: "",
    respond: "",
    userCreation: ""
  }
 
  DataUser(){
    this.dataUser =  localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.user = this.dataUser.user
    console.log(this.dataUser)
    console.log(this.user)
    this.checkQuestions(this.user)
  }
 
  questionsCreateForm(){
    let formularioValido: any = document.getElementById("questionsForm");
    if(formularioValido.reportValidity()){
     this.createQuestion.idUser=this.user
     this.createQuestion.questions=this.question
     this.createQuestion.respond=this.response
     this.createQuestion.userCreation=this.user
     console.log(this.createQuestion)


     this.requestQuestionCreate(this.createQuestion).subscribe(
      (response: any) => this.responseQuestionCreate(response)
    )
    }



    
    

  }

  requestQuestionCreate(response:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url+"/questionsCreate" , response, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseQuestionCreate(response:any){

console.log(response)
this.checkQuestions(this.user)
  }





  passwordCreateForm(){
    
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

  checkQuestions(response:any) {
    
    this.RequestQuestions(response).subscribe(
      (response: any) => this.ResponseQuestions(response)
    )
  }
  RequestQuestions(response:any) {
    
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url+"/questionUserAll/" + response, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseQuestions(response: any) {
    console.log(response)
    if (response == null) {
    } else if(response == 1){
      alert("no hay servicio ")
    }else {
      this.QuestionsData = response;
      this.user = this.QuestionsData[0].idUser;
      console.log("se obtuvo data de preguntas")
    for(var x=0;x<this.QuestionsData.length;x++){
      this.QuestionsData[x].respond = ''
    }
    }
  }


}