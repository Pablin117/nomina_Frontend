import { Component,OnInit } from '@angular/core';
import {catchError} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RoleService } from './role.service'; // Importa tu servicio

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  //variables
  VarRolOption: any = [];
  rol :any = [];
  constructor(private http: HttpClient,private roleService: RoleService) { }

  ngOnInit(): void {
    this.RolOption()

  }


  RolOption(){
    this.RequestRolOption().subscribe(
      (response: any) => this.ResponseRolOption(response)
    )
  }

  RequestRolOption(){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/roleOption/2" , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseRolOption(response:any){
    this.VarRolOption = response
    console.log(this.VarRolOption)
    this.rol = this.VarRolOption.idRole;
    this.roleService.setUserRoles(this.rol);
    const userRoles = this.roleService.getUserRoles();
    console.log(this.rol)

  }

}



