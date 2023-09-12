import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyRulesComponent {

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.CompanyData()
   
  }

  //variables
  BussinessRules: any = [] ;
  url: String = "http://localhost:4042/v1"

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
this.BussinessRules = response
console.log("Se obtuvo configuracion de empresa")

}


formCompany(){
  if(this.BussinessRules[0].passwordAmountSpecialCharacters<1 ){
    alert("La cantidad de caracteres especiales debe ser mayor a 1")
  }
  if(this.BussinessRules[0].passwordAmountNumber<1 ){
    alert("La cantidad de caracteres de números debe ser mayor a 1")
  }
  if(this.BussinessRules[0].passwordAmountLowercase<1 ){
    alert("La cantidad de caracteres de minusculas debe ser mayor a 1")
  }
  if(this.BussinessRules[0].passwordAmountUppercase<1 ){
    alert("La cantidad de caracteres de mayusculas debe ser mayor a 1")
  }

  this.RequestCompanyUpdate().subscribe(
    (response: any) => this.ResponseCompanyUpdate(response)
  ) 
}

RequestCompanyUpdate(){
  console.log(this.BussinessRules[0])
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.post<any>(this.url+"/bussinesRulesModify",this.BussinessRules[0] , httpOptions).pipe(
    catchError(e => "1")
  )
}

ResponseCompanyUpdate(response:any){
  if(response.code ==1){
    console.log(response)
    alert(response.message)
  }else{
    alert(response.message)
  }

}


}
