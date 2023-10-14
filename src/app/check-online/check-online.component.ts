import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-check-online',
  templateUrl: './check-online.component.html',
  styleUrls: ['./check-online.component.css']
})
export class CheckOnlineComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }


  ngOnInit() {

    this.conexion()

  }

  //boolean

  tab: boolean = true

  //objetos

  UserData: any = []
  dataUser: any = {}
  stateUser: any = {}

  //url

  page = 1;
  pageSize = 0
  tamColeccion: number = 0



  //obtiene los generos
  conexion() {
    this.requestUser().subscribe(
      (response: any) => this.responseUser(response)
    )

  }
  requestUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/user2", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseUser(response: any) {
    this.UserData = response
    this.Estado()
  }

  //obtiene los generos
  Estado() {
    this.request().subscribe(
      (response: any) => this.response(response)
    )

  }
  request() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/statusUser", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  response(response: any) {
    this.stateUser = response
    this.tamColeccion = response.length
    this.pageSize = 10


  }



  //para eliminar

  Delete(response: any) {


    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }

  requestDelete(response: any) {
    let root = "root"
    let pass = "admin"
    return this.http.get<any>(this.url.urlData2+ "/" + response.idUser + "/" + root +"/" + pass ).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response: any) {

    alert("se desconecata")
    this.router.navigateByUrl("/")
  }





  //retorna el nombre de la compañia con el id company
  getNameStatusUser(idStatusUser: number): string {
    for (let x = 0; x < this.stateUser.length; x++) {
      if (this.stateUser[x].idStatusUser == idStatusUser) {
        return this.stateUser[x].name
      }
    }
    return '';
  }


}
