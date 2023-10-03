import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent {
  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.validateSession()

  }


  //variables

  //boolean
  modify: boolean = false
  tab: boolean = false
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  //url
  page: string = "role-user"
  url: String = "http://localhost:4042/v1"
  //objetos
  personDataModify: any = {}
  personDataCreate: any = {}
  personData: any = []
  dataUser: any = {}
  selectedEmployee: any = []
  selectedposition: any = []
  userData: any = []
  positionData: any = []
  maritalData: any = []
  employeeData: any = []
  options: any = {}
  locationsData: any = []
  statusEmployeeData: any = []
  


  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()


    } else {
      this.router.navigateByUrl("/")
    }
  }

  generatePayroll(){
    this.person()
    
  }



  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

    let permisos: any = {}
    this.options.forEach((item: any) => {
      if (item.page === this.page) {
        permisos = item.permisos
      }
    })
    permisos.forEach((item: any) => {
      this.btnAdd = item.up == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
     
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })
  }



  //banderas

  Modify(id: any) {
    console.log("modifica")
    this.personDataModify = id
    this.tab = false
    this.modify = true
    this.header = false

  }
  back() {
    console.log("back")
    this.modify = false
    this.tab = true
    this.header = true
    this.personDataCreate = {}
    this.personDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }



  //obtiene planilla
  person() {
    this.requestPerson().subscribe(
      (response: any) => this.responsePerson(response)
    )

  }
  requestPerson() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/PayrollCalc/2023/09/admin", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePerson(response: any) {
    this.personData = response
    this.persons()
    this.tab=true
  }


    //obtiene empleado
    persons() {
      this.requestPersons().subscribe(
        (response: any) => this.responsePersons(response)
      )
  
    }
    requestPersons() {
      var httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      return this.http.get<any>(this.url + "/persons", httpOptions).pipe(
        catchError(e => "1")
      )
    }
    responsePersons(response: any) {
      this.employeeData = response
      this.statusEmployeeService()
    }
  
    getEmployeeName(idPerson: number): string {
      for (let x = 0; x < this.employeeData.length; x++) {
        if (this.employeeData[x].idPerson == idPerson) {
          return this.employeeData[x].name
        }
      }
      return '';
    }


        //obtiene puestos
        position() {
          this.requestPosition().subscribe(
            (response: any) => this.responsePosition(response)
          )
      
        }
        requestPosition() {
          var httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          }
          return this.http.get<any>(this.url + "/positions", httpOptions).pipe(
            catchError(e => "1")
          )
        }
        responsePosition(response: any) {
          this.positionData = response
        }
      
        getPositionName(idPosition: number): string {
          for (let x = 0; x < this.positionData.length; x++) {
            if (this.positionData[x].idPosition == idPosition) {
              return this.positionData[x].name
            }
          }
          return '';
        }


  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.personDataModify.userModification = this.dataUser.user
      this.personDataModify = this.personDataModify
      this.requestAbsenceUpdate().subscribe(
        (response: any) => this.responseAbsenceUpdate(response)
      )
    }
  }

  requestAbsenceUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updatePerson/" + this.personDataModify.idPerson, this.personDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseAbsenceUpdate(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }


  //cierre de sesion
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
    return this.http.get<any>(this.url + "/revoke/" + this.dataUser.session, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseRevoke(response: any) {
    if (response.code == 0) {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }
  }

  //Obtiene datos de status empleados
  statusEmployeeService (){
    this.RequestStatusEmployee().subscribe(
      (response: any) => this.ResponseStatusEmployee(response)
    )
  }

  RequestStatusEmployee() {
    return this.http.get<any>(this.url + "/statusEmployee").pipe(catchError(e => "1"))
  }
  ResponseStatusEmployee(response: any) {
    this.statusEmployeeData = response
    this.position()
  }
  getStatusEmployeeName(idStatusEmployee: number): string {
    for (let x = 0; x < this.statusEmployeeData.length; x++) {
      if (this.statusEmployeeData[x].idStatusEmployee == idStatusEmployee) {
        return this.statusEmployeeData[x].name
      }
    }
    return '';
  }


}
