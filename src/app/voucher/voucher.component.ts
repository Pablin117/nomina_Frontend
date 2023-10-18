import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent {

  constructor(private http: HttpClient, private router: Router, private url: AppComponent) { }

  ngOnInit() {
    this.validateSession()

  }


  //vars

  dataUser: any = {}
  options: any = {}
  employees: any = []
  employee: any = {}

  person: any = {}


  //boolean
  btnAdd: boolean = false
  btnUpdate: boolean = false
  btnDelete: boolean = false
  print: boolean = false
  exporte: boolean = false
  tab: boolean = false
  header: boolean = true


  // pagina 
  pageUrl: String = "role"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0
  //valida sesiones
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.employeeService()
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

  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

    let permisos: any = {}
    this.options.forEach((item: any) => {
      if (item.page === this.pageUrl) {
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


  //Obtiene datos de rol
  employeeService() {
    this.RequestEmployee().subscribe(
      (response: any) => this.ResponseEmployee(response)
    )
  }
  RequestEmployee() {
    return this.http.get<any>(this.url.urlData + "/employee").pipe(
      catchError(e => "1")
    )
  }
  ResponseEmployee(response: any) {
    this.employees = response
    this.tamColeccion = response.length
    this.pageSize = 10
    this.personService()
  }


  //Obtiene datos de rol
  personService() {
    this.RequestPerson().subscribe(
      (response: any) => this.ResponsePerson(response)
    )
  }
  RequestPerson() {
    return this.http.get<any>(this.url.urlData + "/persons").pipe(
      catchError(e => "1")
    )
  }
  ResponsePerson(response: any) {


    this.person = response

  }


  //retorna el nombre de las personas
  getPersonName(idEmployee: number): string {

    for (let x = 0; x < this.person.length; x++) {
      if (this.person[x].idPerson == idEmployee) {
        return this.person[x].name
      }
    }
    return '';
  }


  dataEmployee(data: any) {
    this.employee = data

    console.log(this.employee);

    this.employees.forEach((element: any) => {
      if (this.employee == element.idEmployee) {
        this.employee = element

      }

    });

    let employeeData = this.employee

    let base = employeeData.baseSalaryIncome
    let bono = employeeData.bonusIncomeDecree
    let ing = employeeData.incomeOther
    let igss = employeeData.igss
    let isr = employeeData.isr
    let otroD = employeeData.noShowDiscount

    let ingreso = base + bono + ing
    let descuento = igss - isr - otroD
    let total = ingreso - descuento

    this.employee.total = total
    this.tab = true

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
        this.router.navigateByUrl("/")
        localStorage.clear()
      } else {
        alert(response.message)
        this.router.navigateByUrl("/")
        localStorage.clear()
      }
    }
  


}
