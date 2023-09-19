import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  logData: any = [];
  tab: boolean = true;
  url: String = "http://localhost:4042/v1";


  ngOnInit() {
    this.logService();
  }

  logService() {
    this.RequestLog().subscribe(
      (response: any) => this.ResponseLog(response)
    )
  }
  


  RequestLog() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/log", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseLog(response: any) {
    this.logData = response;
    console.log("Se obtuvo la bitacora");
   console.log(response)
  }
}
