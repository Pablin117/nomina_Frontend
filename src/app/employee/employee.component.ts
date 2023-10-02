import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.validateSession()

  }


  //variables
  //boolean
  modify: boolean = false
  tab: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  btnDelete: boolean = false
  print: boolean = false
  exporte: boolean = false

  //objects
  employeeDataModify: any = {}
  employeeDataCreate: any = {}
  employeeData: any = []
  personData: any = []
  locationsData: any = []
  positionData: any = []
  statusEmployeeData: any = []
  dataUser: any = {}
  options: any = {}

  namePerson: String = ""



  // pagina y url
  url: String = "http://localhost:4042/v1"
  page: String = "marital-status"

  name = 'employee.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  //valida sesiones
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.optionsValidate()
      this.employeeService()
    } else {
      this.router.navigateByUrl("/")
    }
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
      this.btnDelete = item.down == 1 ? true : false
      this.print = item.print == 1 ? true : false
      this.exporte = item.export == 1 ? true : false
    })
  }



  //formulario para modificar
  modForm() {
    let formularioValido: any = document.getElementById("modForm")
    if (formularioValido.reportValidity()) {
      this.employeeDataModify.userModification = this.dataUser.user

      console.log(this.employeeDataModify);
      
      this.RequestemployeeUpdate().subscribe(
        (response: any) => this.ResponseemployeeUpdate(response)
      )
    }
  }

  RequestemployeeUpdate() {

    return this.http.put<any>(this.url + "/updateEmployee/" + this.employeeDataModify.idEmployee, this.employeeDataModify,).pipe(
      catchError(e => "1")
    )
  }
  ResponseemployeeUpdate(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }

  }


  //para eliminar
  Delete(response: any) {
    this.requestDelete(response).subscribe(
      (response: any) => this.responseDelete(response)
    )
  }
  requestDelete(response: any) {

    return this.http.delete<any>(this.url + "/deleteemployee/" + response.idemployee + "/" + this.dataUser.user,).pipe(
      catchError(e => "1")
    )
  }
  responseDelete(response: any) {

    if (response.code == 999) {

      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }



  //banderas


  Modify(response: any) {
    this.employeeDataModify = response
    this.tab = false
    this.modify = true
    this.header = false

    this.namePerson = this.getPersonName(response.idPerson)
    console.log(this.namePerson)
  }
  back() {
    this.tab = true
    this.modify = false
    this.header = true
    this.employeeDataCreate = {}
    this.employeeDataModify = {}
    this.ngOnInit()
  }
  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  //cierre de sesion
  revoke() {
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }
  RequestRevoke() {

    return this.http.get<any>(this.url + "/revoke/" + this.dataUser.session,).pipe(
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

  //Obtiene datos de empleado
  employeeService() {
    this.RequestEmployee().subscribe(
      (response: any) => this.ResponseEmployee(response)
    )
  }

  RequestEmployee() {
    return this.http.get<any>(this.url + "/employee",).pipe(
      catchError(e => "1")
    )
  }

  ResponseEmployee(response: any) {
    this.employeeData = response

    this.locationService()
  }

  //obtine sucursales
  locationService() {
    this.RequestLocation().subscribe(
      (response: any) => this.ResponseLocation(response)
    )
  }
  RequestLocation() {

    return this.http.get<any>(this.url + "/location",).pipe(
      catchError(e => "1")
    )
  }
  ResponseLocation(response: any) {
    this.locationsData = response
    this.positionService()
  }

  //Obtiene datos de company
  positionService() {

    this.RequestPosition().subscribe(
      (response: any) => this.ResponsePosition(response)
    )
  }
  RequestPosition() {

    return this.http.get<any>(this.url + "/positions").pipe(
      catchError(e => "1")
    )
  }
  ResponsePosition(response: any) {
    this.positionData = response
    this.personService()
  }

  //Obtiene datos de persona
  personService() {
    this.RequestPerson().subscribe(
      (response: any) => this.ResponsePerson(response)
    )
  }
  RequestPerson() {
    return this.http.get<any>(this.url + "/persons").pipe(catchError(e => "1"))
  }
  ResponsePerson(response: any) {
    this.personData = response
    this.statusEmployeeService()
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
    console.log(response)
  }

  //retorna el nombre de la compañia con el id company
  getLocationName(idLocation: number): string {
    for (let x = 0; x < this.locationsData.length; x++) {
      if (this.locationsData[x].idLocation == idLocation) {
        return this.locationsData[x].name
      }
    }
    return '';
  }
  //retorna el nombre del puesto
  getPositionName(idPosition: number): string {
    for (let x = 0; x < this.positionData.length; x++) {
      if (this.positionData[x].idPosition == idPosition) {
        return this.positionData[x].name
      }
    }
    return '';
  }

  //retorna el nombre de las personas
  getPersonName(idPerson: number): string {

    for (let x = 0; x < this.personData.length; x++) {
      if (this.personData[x].idPerson == idPerson) {
        return this.personData[x].name
      }
    }
    return '';
  }


  //retorna el estado del empleado
  getStatusEmployee(idStatusEmployee: number): string {

    for (let x = 0; x < this.statusEmployeeData.length; x++) {
      if (this.statusEmployeeData[x].idStatusEmployee == idStatusEmployee) {
        return this.statusEmployeeData[x].name
      }
    }
    return '';
  }
}
