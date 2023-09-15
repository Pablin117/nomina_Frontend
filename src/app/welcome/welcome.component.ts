import { Component,OnInit } from '@angular/core';
import {catchError} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  //variables
  VarRolOption: any = [];
  VarUserRol: any = [];
  VarModulo: any=[];
  VarRol: any=[];
  VarOption:any=[];
  VarMenu:any=[];
  rol :any = [];
  DataUser :any = {};


  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.RolOption()
    this.UserRol();
    //this.Modulo();
  }

///////////////////Empieza la consulta del Rol con su opcion
  RolOption(){
    this.DataUser = localStorage.getItem("data");
    this.DataUser = JSON.parse(this.DataUser)
    this.RequestRolOption(this.DataUser.user).subscribe(
      (response: any) => this.ResponseRolOption(response)
    )
  }

  RequestRolOption(idRolOption:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/roleOption/"+idRolOption , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRolOption(response:any){
    this.VarRolOption = response
    this.rol = this.VarRolOption.idRole;
    this.Option();

  }
////////////////Empieza la consulta del usuario y su rol
  UserRol(){
    this.DataUser = localStorage.getItem("data");
    this.DataUser = JSON.parse(this.DataUser)
    this.RequestUserRol().subscribe(
      (response: any) => this.ResponseUserRol(response)
    )
  }

  RequestUserRol(){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/userRole/"+this.DataUser.user , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseUserRol(response:any){
    this.VarUserRol = response;
  }

/////////////////Empieza la consulta de las opciones
  Option(){
    console.log(this.VarRolOption)
    this.RequestOption(this.VarRolOption.idOption).subscribe(
      (response: any) => this.ResponseOption(response)
    )
  }

  RequestOption(idOption: any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/option/"+idOption , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseOption(response:any){
    this.VarOption = response;
    this.Menu();
    console.log(this.VarOption)
  }

  ////////////////////////Empieza la consulta de menus

  Menu(){
    this.RequestMenu(this.VarOption.idMenu).subscribe(
      (response: any) => this.ResponseMenu(response)
    )
  }

  RequestMenu(idMenu: any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/menu/"+idMenu , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseMenu(response:any){
    this.VarMenu = response;
    this.Modulo();
    console.log(this.VarMenu)
  }
  ////////////////////////////Empieza la consulta de Modulos
  Modulo(){
    this.RequestModulo(this.VarMenu.idModulo).subscribe(
      (response: any) => this.ResponseModulo(response)
    )
  }

  RequestModulo(idModulo:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/module/"+idModulo , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseModulo(response:any){
    this.VarModulo = response;
    console.log(this.VarModulo)
  }

}



