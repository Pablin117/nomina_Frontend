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

  //diboy
  data: any = {}
  url: String = "http://localhost:4042/v1"
  modulos: any = []
  header: boolean = true

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  
    this.recoverUser();
  }

  //DIBOY START
  recoverUser() {
    this.data = localStorage.getItem("data")
    this.data = JSON.parse(this.data)
    console.log(this.data)

    //Busqueda de role-opcion-menu-modulo usuario
    this.searchOptionsUserService().subscribe(
      (response: any) => this.responseSearchOptionsUserService(response)
    )
  }

  //consumer service login
  searchOptionsUserService() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/search/" + this.data.user, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseSearchOptionsUserService(response: any) {
    console.log(response)
    var opciones = []

    //module
    //menu
    //option
    //opciones de las opciones (roleOption) -> permisos

    for (var option of response.option) {
      option.permisos = []
      for (var permiso of response.roleOption) {
        if (permiso.idPK.idOption == option.idOption) {
          option.permisos.push(permiso)
        }
      }
      opciones.push(option)
    }

    //console.log(opciones)
    var menus = []

    for (var menu of response.menu) {
      menu.opciones = []
      for (var opcion of opciones) {
        if (opcion.idMenu == menu.idMenu) {
          menu.opciones.push(opcion)
        }
      }
      menus.push(menu)
    }

    //console.log(menus)
    var modulos = []
    for (var modulo of response.module) {
      modulo.menus = []
      for (var menu of menus) {
        if (menu.idModulo == modulo.idModule) {
          modulo.menus.push(menu)
        }
      }
      modulos.push(modulo)
    }

    console.log(modulos)
    this.modulos = modulos


    //error in consumption
    if (response == null || response == "e") {
      console.log("No hay comunicación con el servidor!!")

    }
  }
  //DIBOY END

  //perdido
  Calcular(obj: object): number {
    const keys = Object.keys(obj)
    return keys.length
  }


  revoke() {
    console.log("salida")
    console.log(this.data.session)
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }


  RequestRevoke() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/revoke/" + this.data.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRevoke(response: any) {
    if (response.code == 0) {
      console.log(response)
      alert(response.message)

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }
}


