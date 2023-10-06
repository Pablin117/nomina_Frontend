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
  add:boolean = false
  modify: boolean = false
  tab: boolean = false
  tabPeriodo: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  print: boolean = false
  exporte: boolean = false
  showSpinner: boolean = false
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
  PayrollPeriodsData: any = []
  paryrollPeriodDataCreate: any = {}
  paryrollPeriodDataModify: any = {}
  btnDelete: boolean = false



  //valida la sesion
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.PayrollPeriod()

    } else {
      this.router.navigateByUrl("/")
    }
  }

  generatePayroll(){
    this.person()
    this.tab = true
    this.tabPeriodo = false
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


  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    this.tabPeriodo = false
    console.log("add")
  }
  //banderas

  Modify(id: any) {
    console.log("modifica")
    this.personDataModify = id
    this.tabPeriodo = false
    this.tab = false
    this.modify = true
    this.header = false

  }
  back() {
    console.log("back")
    this.modify = false
    this.tab = true
    this.tabPeriodo = true
    this.header = true
    this.personDataCreate = {}
    this.personDataModify = {}
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }


 //obtine modulos
 PayrollPeriod() {
  this.RequestParyrollPeriod().subscribe(
    (response: any) => this.ResponsePayrollPeriod(response)
  )
}

RequestParyrollPeriod() {
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this.http.get<any>(this.url + "/payrollPeriod", httpOptions).pipe(
    catchError(e => "1")
  )
}

ResponsePayrollPeriod(response: any) {
  this.PayrollPeriodsData = response
  console.log(response);
  
  console.log(this.PayrollPeriodsData.idPK)
}



  //obtiene planilla
  person() {
    this.showSpinner = true
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
    this.tabPeriodo=true
    this.tab = false
    this.showSpinner = false
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


  //agrega
  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {

      this.paryrollPeriodDataCreate.userCreation = this.dataUser.user
      this.RequestPayrollPeriodSave().subscribe(
        (response: any) => this.ResponseParyrollPeriodSave(response)
      )

    }
  }
  RequestPayrollPeriodSave() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url + "/createPayrollPeriod", this.paryrollPeriodDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseParyrollPeriodSave(response: any) {
    if(response.code == 999){

      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()

    } else {
      alert(response.message)
    }


  }

  //modifica
  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.paryrollPeriodDataModify.userModification = this.dataUser.user
      this.RequestPayrollPeriodSaveM().subscribe(
        (response: any) => this.ResponsePayrollPeriodSaveM(response)
      )

    }
  }
  RequestPayrollPeriodSaveM() {
    console.log("se agrega")
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/updatePayrollPeriod", this.paryrollPeriodDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsePayrollPeriodSaveM(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      console.log("si")
      this.back()

    } else {
      alert(response.message)
    }
  }

//para eliminar

  Delete(response:any){
    console.log(response)
    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }

  requestDelete(response:any){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<any>(this.url + "/deletePayrollPeriod/"+response.idModule+"/"+this.dataUser.user, httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseDelete(response:any){
    if (response.code == 0) {

      alert(response.message)
      this.back()

    } else {
      alert(response.message)
    }
  }

 

}
