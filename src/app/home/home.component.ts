import { Component } from '@angular/core';
import { catchError, connect } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) {
  }

  ngOnInit() {
    this.validateSession()
  }




  //variables
  public isCollapsed = true;
  prueba = "1"
  //objectos
  options: any = []
  modulos: any = []
  dataUser: any = {}
  //boolean
  header: boolean = true
  //url



  //valida la sesion
  validateSession() {

    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)


      
      this.recoverUser();

    } else {
      this.router.navigateByUrl("/")
    }
  }


  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  //DIBOY START
  redirect(name : any){

  }

  recoverUser() {
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
    return this.http.get<any>(this.url.urlData + "/search/" + this.dataUser.user, httpOptions).pipe(
      catchError(e => "e")
    )
  }

  //response service login
  responseSearchOptionsUserService(response: any) {
  

    //error in consumption
    if (response == null || response == "e") {

    } else if (response.code[0] == 1) {
      alert(response.message)
      this.revoke()
    } else if (response.code[0] == 0) {
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
      localStorage.setItem("options", JSON.stringify(opciones));
      this.modulos = modulos
      
    }
    this.revokeOptions()
  }
  //DIBOY END


  //finaliza la sesion
  revoke() {
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
    return this.http.get<any>(this.url.urlData + "/revoke/" + this.dataUser.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRevoke(response: any) {
    if (response.code == 0) {
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

  

  revokeOptions(){
    this.options = localStorage.getItem("options");    
    this.options = JSON.parse(this.options)

    if (this.options.length==0){
      alert("No tienes asignada opciones")
      this.revoke()
    }
  }
  


}
