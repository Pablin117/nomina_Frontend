import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']

})
export class SetPasswordComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.CompanyData()
    this.DataUser()
    this.validateSession()
  }

  validateSession(){
    if(this.dataUser != null){
      console.log("activo")
    }else{
      this.router.navigateByUrl("/")
    }
  }
  //variables
  QuestionsData: any = [];
  user: string = "";
  questionComplete: boolean = false;
  questionCreate: boolean = false;
  question: string = "";
  response: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  BussinessRules: any;
  dataUser: any = {}
  url: string = "http://localhost:4042/v1"

 
  confirmar = document.getElementById("Confirmar")

  DataUser() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.user = this.dataUser.user
    this.checkQuestions(this.user)
  }
  checkQuestions(response: any) {

    this.RequestQuestions(response).subscribe(
      (response: any) => this.ResponseQuestions(response)
    )
  }
  RequestQuestions(response: any) {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/questionUserAll/" + response, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseQuestions(response: any) {
    if (response === null) {
      console.log("no hay preguntas")
    } else {
      //guardo las preguntas
      this.QuestionsData = response;
      this.user = this.QuestionsData[0].idUser;
      console.log("se obtuvo data de preguntas")

      let fillString = "***";
      let count = fillString.length;
      for (var x = 0; x < this.QuestionsData.length; x++) {
        //cambio la respuesta de las preguntas por x
        this.QuestionsData[x].respond = fillString.repeat(count);
      }
      console.log(this.QuestionsData)
      this.questionCreate = true;
    }
  }

  questionsCreateForm() {
    let formularioValido: any = document.getElementById("questionsForm");
    if (formularioValido.reportValidity()) {

      const newQuestion = {
        idUser: this.user,
        questions: this.question,
        respond: this.response,
        userCreation: this.user
      }

      console.log(newQuestion)
      this.requestQuestionCreate(newQuestion).subscribe(
        (response: any) => this.responseQuestionCreate(response)
      )

    }
  }

  requestQuestionCreate(response: any) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/questionsCreate", response, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseQuestionCreate(response: any) {
    console.log(response)
    if(response.code ==0){
      this.checkQuestions(this.user)
    }else if(response.code == 1){
      alert(response.message)
    }else{
      alert(response.message)
    }
  }

  passwordCreateForm() {
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
    console.log(passwordData)
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

  CompanyData() {
    this.RequestCompany().subscribe(
      (response: any) => this.ResponseCompany(response)
    )
  }

  RequestCompany() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/bussinesRules", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseCompany(response: any) {
    this.BussinessRules = response[0]
    console.log("Se obtuvo configuracion de empresa")
  }


  Confirm(){
    this.questionComplete = true
    this.questionCreate = false
  }
  
  


}
