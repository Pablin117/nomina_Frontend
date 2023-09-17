import { Component,OnInit } from '@angular/core';
import {catchError, connect} from 'rxjs/operators';
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
  VarOptionsRol: any={};
  VarOption:any=[];
  VarMenu:any=[];
  rol :any = {};
  DataUser :any = {};
  info : any =[];
  busqueda : any =[];
  Modul:any =[];
  VarMenu1:any=[];



  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.UserRol();
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
  this.RolOption()
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
    return this.http.get<any>("http://localhost:4042/v1/roleOption", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRolOption(response:any){
    this.VarRolOption = response
    for(let x = 0;x<this.VarRolOption.length;x++){
        this.rol=this.VarRolOption[x].idPK;
        if(this.rol.idRole==this.VarUserRol.idRole){
          this.VarOptionsRol = this.rol.idOption;
            this.Option();
        }
      }

  }

/////////////////Empieza la consulta de las opciones
  Option(){
    this.RequestOption(this.VarOptionsRol).subscribe(
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

    this.Menu(this.VarOption.idMenu);
  }

  ////////////////////////Empieza la consulta de menus

  Menu(idMenu:any){
    this.RequestMenu(idMenu).subscribe(
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
    this.VarMenu1.push(this.VarMenu)
    console.log(this.VarMenu1)
    this.Modulo();
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
    this.info.push(this.VarModulo)
    for(let x=0;x<this.info.length;x++){
      this.busqueda.push(this.info[x].name)
    }
    let resultado = this.busqueda.reduce((a:any,e:any)=>{
      if(!a.find((d: any)=> d ==e)){
        a.push(e)
      }
      return a;
    }, []);
    this.Modul=resultado;
  }

}



