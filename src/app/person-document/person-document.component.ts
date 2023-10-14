import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-person-document',
  templateUrl: './person-document.component.html',
  styleUrls: ['./person-document.component.css']
})
export class PersonDocumentComponent {


  constructor(private http: HttpClient, private router: Router, private url:AppComponent) { }

  ngOnInit() {
    this.validateSession()

  }

  //variables
  //boolean
  modify: boolean = false
  add: boolean = false
  tab: boolean = true
  header: boolean = true
  btnAdd: boolean = false
  btnUpdate: boolean = false
  btnDelete: boolean = false
  print: boolean = false
  exporte: boolean = false

  //objects
  personDocumentModify: any = {}
  personDocumentCreate: any = {}
  personDocumentData: any = []
  dataUser: any = {}
  options: any = {}
  personDocumentDataComplete: any = []
  personData: any = {}
  TypeDocumentsData: any = {}


  // pagina y url
  pageUrl: String = "personal-document"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0



  //valida sesiones
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.personDocumentService()
      this.TypeDocument()
      this.person()
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


  //Obtiene datos de personDocument
  personDocumentService() {
    this.RequestpersonDocument().subscribe(
      (response: any) => this.ResponsepersonDocument(response)
    )
  }
  RequestpersonDocument() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/personDocument", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsepersonDocument(response: any) {
    this.personDocumentData = response
    this.optineData()

  }

  //formulario para modificar
  modForm() {
    let formularioValido: any = document.getElementById("modForm")

    this.personDocumentModify.userModification = this.dataUser.user
    this.RequestpersonDocumentUpdate().subscribe(
      (response: any) => this.ResponsepersonDocumentUpdate(response)
    )
  }

  optineData() {


  }



  RequestpersonDocumentUpdate() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updatepersonDocument/" + this.personDocumentModify.idpersonDocument, this.personDocumentModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsepersonDocumentUpdate(response: any) {
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
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.delete<any>(this.url.urlData + "/deletepersonDocument/" + response.idpersonDocument + "/" + this.dataUser.user, httpOptions).pipe(
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

  //formulario para agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.personDocumentCreate.userCreation = this.dataUser.user
      this.RequestpersonDocumentSave().subscribe(
        (response: any) => this.ResponsepersonDocumentSave(response)
      )
    }
  }
  RequestpersonDocumentSave() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createpersonDocument", this.personDocumentCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponsepersonDocumentSave(response: any) {
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

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
  }


  Modify(response: any) {
    this.personDocumentModify = response
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }


  back() {
    this.tab = true
    this.add = false
    this.modify = false
    this.header = true
    this.personDocumentCreate = {}
    this.personDocumentModify = {}
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



  //retorna el nombre de la compañia con el id company
  getPersonName(idPerson: number): string {
    for (let x = 0; x < this.personData.length; x++) {
      if (this.personData[x].idPerson == idPerson) {
        return this.personData[x].name
      }
    }
    return '';
  }


  //retorna el nombre de la compañia con el id company
  getDocumentName(idTypeDocument: number): string {
    for (let x = 0; x < this.TypeDocumentsData.length; x++) {
      if (this.TypeDocumentsData[x].idTypeDocument == idTypeDocument) {
        return this.TypeDocumentsData[x].name
      }
    }
    return '';
  }




  //obtine modulos
  TypeDocument() {
    this.RequestTypeDocument().subscribe(
      (response: any) => this.ResponseTypeDocument(response)
    )
  }

  RequestTypeDocument() {

    return this.http.get<any>(this.url.urlData + "/typeDocument").pipe(
      catchError(e => "1")
    )
  }

  ResponseTypeDocument(response: any) {
    this.TypeDocumentsData = response

  }


  //obtine modulos
  person() {
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
    this.personData = response
    this.tamColeccion = response.length
    this.pageSize = this.tamColeccion / 10
  }


}
