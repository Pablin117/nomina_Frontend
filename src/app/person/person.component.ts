
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { Component, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})



export class PersonComponent {
  constructor(private http: HttpClient, private router: Router, private url:AppComponent) {

  }


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
  DataDocument: boolean = false
  DataDocumentM: boolean = false
  //url
  pageUrl: string = "person"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0

  //objetos
  personDataModify: any = {}
  personDataCreate: any = {}
  personData: any = []
  dataUser: any = {}
  selectedGender: any = []
  selectedMarital: any = []
  userData: any = []

  maritalData: any = []
  options: any = {}

  employeeDataCreate: any = {}

  locationsData: any = []
  positionData: any = []
  statusEmployeeData: any = []
  genderData: any = []
  documentPerson: any = []

  documentPersonCreate: any = {}
  documentPersonModify: any = {}
  documentData: any = []
  documentPersonData: Array<any> = []
  documentList: Array<any> = [];

  idt: any = {}


  name = 'reporte.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('table-consult');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }


  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.optionsValidate()
      this.person()
      this.gender()
      this.documentService()
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

  //banderas
  Modify(id: any) {
    this.personDataModify = id
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
    this.DataDocumentM = true;
    this.documentPersonService(this.personDataModify)
  }
  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
  }
  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.personDataCreate = {}
    this.personDataModify = {}
    this.documentPersonData = []
    this.documentPersonData = []
    this.ngOnInit()
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
  }



  //obtiene puestos
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
    return this.http.get<any>(this.url.urlData + "/persons", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePerson(response: any) {
    this.personData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }




  //obtiene generos
  gender() {
    this.requestGender().subscribe(
      (response: any) => this.responseGender(response)
    )
  }
  requestGender() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseGender(response: any) {
    this.genderData = response
    this.locationService()
  }
  getGenderName(idGender: number): string {
    for (let x = 0; x < this.genderData.length; x++) {
      if (this.genderData[x].idGender == idGender) {
        return this.genderData[x].name
      }
    }
    return '';
  }


  //obtiene estado civil
  marital() {
    this.requestMarital().subscribe(
      (response: any) => this.responseMarital(response)
    )

  }
  requestMarital() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/maritalStatus", httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responseMarital(response: any) {
    this.maritalData = response
  }
  getMaritalName(idMaritalStatus: number): string {
    for (let x = 0; x < this.maritalData.length; x++) {
      if (this.maritalData[x].idMaritalStatus == idMaritalStatus) {
        return this.maritalData[x].name
      }
    }
    return '';
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
    return this.http.delete<any>(this.url.urlData + "/deletePerson/" + response.idPerson + "/" + this.dataUser.user, httpOptions).pipe(
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

  //modificacion

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.personDataModify.userModification = this.dataUser.user
      this.personDataModify = this.personDataModify

      const requestData = {
        person: this.personDataModify,
        personDocumentTempsList: ""
      };



      this.requestPersonUpdate().subscribe(
        (response: any) => this.responsePersonUpdate(response)
      )
    }
  }

  requestPersonUpdate() {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url.urlData + "/updatePerson/" + this.personDataModify.idPerson, this.personDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  responsePersonUpdate(response: any) {
    if (response.code == 999) {
      this.revoke()
    } else if (response.code == 0) {
      alert(response.message)
      this.back()
    } else {
      alert(response.message)
    }
  }


  //agregar

  addForm() {
    let formularioValido: any = document.getElementById("addForm");
    if (formularioValido.reportValidity()) {
      this.personDataCreate.userCreation = this.dataUser.user

      const requestData = {
        person: this.personDataCreate,
        employee: this.employeeDataCreate,
        personDocumentTempsList: this.documentList
      };

      this.requestPersonSave(requestData).subscribe(
        (response: any) => this.responsePersonSave(response)
      )
    }
  }

  requestPersonSave(data: any) {
    return this.http.post<any>(this.url.urlData + "/createPerson", data).pipe(
      catchError(e => "1")
    )
  }
  responsePersonSave(response: any) {

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

  //obtine sucursales
  locationService() {
    this.RequestLocation().subscribe(
      (response: any) => this.ResponseLocation(response)
    )
  }
  RequestLocation() {

    return this.http.get<any>(this.url.urlData + "/location",).pipe(
      catchError(e => "1")
    )
  }
  ResponseLocation(response: any) {
    this.locationsData = response
    this.positionService()
  }


  //obtine sucursales
  documentPersonService(id: any) {

    this.RequestDocumentPerson().subscribe(
      (response: any) => this.ResponseDocumentPerson(response)
    )
  }
  RequestDocumentPerson() {

    return this.http.get<any>(this.url.urlData + "/documentPerson/" + this.personDataModify.idPerson,).pipe(
      catchError(e => e)
    )
  }
  ResponseDocumentPerson(response: any) {



    for (let x = 0; x < response.length; x++) {

      this.documentPersonData.push(response[x])

    }



  }


  //Obtiene datos de company
  positionService() {

    this.RequestPosition().subscribe(
      (response: any) => this.ResponsePosition(response)
    )
  }
  RequestPosition() {

    return this.http.get<any>(this.url.urlData + "/positions").pipe(
      catchError(e => "1")
    )
  }
  ResponsePosition(response: any) {
    this.positionData = response
    this.statusEmployeeService()
  }

  //Obtiene datos de status empleados
  statusEmployeeService() {
    this.RequestStatusEmployee().subscribe(
      (response: any) => this.ResponseStatusEmployee(response)
    )
  }

  RequestStatusEmployee() {
    return this.http.get<any>(this.url.urlData + "/statusEmployee").pipe(catchError(e => "1"))
  }
  ResponseStatusEmployee(response: any) {
    this.statusEmployeeData = response
    this.marital()

  }

  //Obtiene documentos por persona
  documentService() {
    this.RequestdocumentPerson().subscribe(
      (response: any) => this.ResponsedocumentPerson(response)
    )
  }
  RequestdocumentPerson() {
    return this.http.get<any>(this.url.urlData + "/typeDocument").pipe(catchError(e => "1"))
  }
  ResponsedocumentPerson(response: any) {
    this.documentData = response
  }


  btnDocument() {

    let formularioValido: any = document.getElementById("documentForm");
    if (formularioValido.reportValidity()) {
      this.DataDocument = true
      let newDocument = { ...this.documentPersonCreate };
      this.documentList.push(this.documentPersonCreate);
      this.documentPersonCreate = {}
    }
  }

  btnDocumentM(document: any) {

    let docu = {
      person: this.personDataModify,
      employee: this.employeeDataCreate,

      personDocumentTemp: {
        idTypeDocument: document.idTypeDocument,
        idPK: {
          idTypeDocument: document.idTypeDocument,
          idPerson: this.personDataModify.idPerson
        },
        numberDocument: document.numberDocument
      }
    }
    this.CreateDocumentosService(docu)
    this.documentPersonData.push(docu.personDocumentTemp)

  }


  CreateDocumentosService(data: any) {

    this.RequestCreateDocument(data).subscribe(
      (response: any) => this.ResponseCreateDocument(response)
    )
  }
  RequestCreateDocument(data: any) {

    return this.http.post<any>(this.url.urlData + "/createPersonDocument", data).pipe(catchError(e => e))
  }
  ResponseCreateDocument(response: any) {



  }

  EliminaDocumento(id: any) {
    this.idt = id
    this.DeleteDocumentosService(id)
  }

  DeleteDocumentosService(data: any) {

    this.RequestDeleteDocument(data).subscribe(
      (response: any) => this.ResponseDeleteDocument(response)
    )
  }
  RequestDeleteDocument(data: any) {
    let id = data.idPK.idPerson
    let doc = data.idPK.idTypeDocument
    return this.http.delete<any>(this.url.urlData + "/DeletePersonDocument/" + id + "/" + doc).pipe(catchError(e => e))
  }
  ResponseDeleteDocument(response: any) {

    let bandera = 0;
    for (const element of this.documentPersonData) {
      if (element.idPK.idTypeDocument == this.idt.idPK.idTypeDocument) {
        break;
      }
      bandera++;
    }

    this.documentPersonData.splice(bandera)

  }




  //retorna el nombre de las personas
  getDocumentPersonName(idTypeDocument: number): string {
    for (let x = 0; x < this.documentData.length; x++) {
      if (this.documentData[x].idTypeDocument == idTypeDocument) {
        return this.documentData[x].name
      }
    }
    return '';
  }







}
