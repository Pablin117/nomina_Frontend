import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {

 constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(){
    this.RoleData()
  }


//variables
RolesData: any = [];
url: String = "http://localhost:4042/v1"

RoleData() {
  this.RequestRole().subscribe(
    (response: any) => this.ResponseRole(response)
  )
}

RequestRole() {
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.get<any>(this.url + "/role", httpOptions).pipe(
    catchError(e => "1")
  )
}

ResponseRole(response: any) {
  this.RolesData = response
  console.log(this.RolesData)
  console.log("Se obtuvo roles")

}

add(){
  console.log("agrega")
}
}
