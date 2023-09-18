import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-module-maintenance',
  templateUrl: './module-maintenance.component.html',
  styleUrls: ['./module-maintenance.component.css']
})
export class ModuleMaintenanceComponent {
 VarModulo: any = [];
 VarName:any=[];
  ngOnInit() {
    this.Modulo();
  }
  constructor(private http: HttpClient) { }
  Modulo(){
    this.RequestModulo().subscribe(
      (response: any) => this.ResponseModulo(response)
    )
  }

  RequestModulo(){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>("http://localhost:4042/v1/module" , httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseModulo(response:any){
    this.VarModulo = response;
    console.log(this.VarModulo)
  }
}
