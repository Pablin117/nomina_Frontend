import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-m',
  templateUrl: './user-m.component.html',
  styleUrls: ['./user-m.component.css']
})
export class UserMComponent {
  constructor(private http: HttpClient, private router: Router) { }

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
  print: boolean = false
  exporte: boolean = false
  btnDelete: boolean = false
  //url
  url: String = "http://localhost:4042/v1"
  pageUrl = "userM"
  page = 1;
  pageSize = 0
  tamColeccion: number = 0
  //objetos
  UsersData: any = []
  userDataCreate: any = {}
  userDataModify: any = {}
  locationsData: any = {}
  statusData: any = {}
  dataUser: any = {}
  file: any
  VarId: any = {}
  options: any = {}
  Varstatus: any = []
  Varlocation: any = []
  Vargender: any = []
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;




  //valida sesiones
  validateSession() {
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.User()
      this.optionsValidate()
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



  User() {
    this.Status()
    this.location()
    this.Gender()
    this.RequestUser().subscribe(
      (response: any) => this.ResponseUser(response)
    )
  }

  RequestUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/user", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseUser(response: any) {
    this.UsersData = response
    this.tamColeccion = response.length
    this.pageSize = 10
  }

  Modify(response: any) {
    this.userDataModify = response
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
  }

  Add() {
    this.modify = false
    this.add = true
    this.tab = false
    this.header = false
    this.router.navigateByUrl("/create")
  }

  back() {
    this.modify = false
    this.add = false
    this.tab = true
    this.header = true
    this.userDataModify = {}
    this.userDataCreate = {}
    this.ngOnInit()
  }

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
        this.userDataModify.userModification = this.dataUser.user
        this.VarId = this.userDataModify.idUser
        this.RequestUserSaveM().subscribe(
        (response: any) => this.ResponseUserSaveM(response)
      )

    }
  }
  RequestUserSaveM() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyUser/" + this.userDataModify.idUser, this.userDataModify, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseUserSaveM(response: any) {
    if(response.code == 999){
      this.revoke()
    }else if (response.code == 0) {
      alert(response.message)
      this.ServiceSaveImage()
      this.deleteImages()
      this.back()
      this.ngOnInit()
    } else {
      alert(response.message)
    }
  }

  revoke() {
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }

  backWelcome() {
    this.router.navigateByUrl("/home")
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

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(selectedFile);
      this.file = selectedFile
    }
  }

  selectImage() {
    // Hacer clic en el input de tipo archivo para abrir el cuadro de diálogo de selección de archivo
    this.fileInput.nativeElement.click();
  }
  deleteImages() {
    this.imageSrc = null;
  }
  deletBack() {
    this.back()
    this.deleteImages()
  }
    ServiceSaveImage() {
        if (this.imageSrc) {
            const idUser = this.VarId; // Reemplaza esto con el ID real del usuario
            //const file = this.fileInput.nativeElement.files[0];
            this.saveImage(idUser, this.file).subscribe(
                (response: any) => this.ResponseImages(response)

            );
        }
    }

    //Guarda la imagen
    saveImage(idUser: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('idUser', idUser);
        return this.http.post(this.url + `/saveImage`, formData);
    }

    ResponseImages(response: any) {
    }

  getStatus(idStatus: number): string {
    for (let x = 0; x < this.Varstatus.length; x++) {
      if (this.Varstatus[x].idStatusUser == idStatus) {
        return this.Varstatus[x].name
      }
    }
    return '';
  }

  Status() {
    this.requestStatus().subscribe(
      (response: any) => this.responseStatus(response)
    )
  }

  requestStatus() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/statusUser", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseStatus(response: any) {
    this.Varstatus = response
  }

  getLocation(idLocation: number): string {
    for (let x = 0; x < this.Varlocation.length; x++) {
      if (this.Varlocation[x].idLocation == idLocation) {
        return this.Varlocation[x].name
      }
    }
    return '';
  }

  location() {
    this.requestLocation().subscribe(
      (response: any) => this.responseLocation(response)
    )
  }

  requestLocation() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/location", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseLocation(response: any) {
    this.Varlocation = response
  }

  getGender(idGender: number): string {
    for (let x = 0; x < this.Vargender.length; x++) {
      if (this.Vargender[x].idGender == idGender) {
        return this.Vargender[x].name
      }
    }
    return '';
  }

  Gender() {
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
    return this.http.get<any>(this.url + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseGender(response: any) {
    this.Vargender = response
  }

    Delete(response:any){
        this.requestDelete(response).subscribe(
            (response: any) => this.responseDelete(response)
        )
    }

    requestDelete(response:any){
    console.log(response)
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.delete<any>(this.url + "/deleteUser/"+response.idUser+"/"+this.dataUser.user, httpOptions).pipe(
            catchError(e => "1")
        )
    }

    responseDelete(response:any){
      if(response.code == 999){
        this.revoke()
      }else if (response.code == 0) {

            alert(response.message)
            this.back()
            this.ngOnInit()
        } else {
            alert(response.message)
        }
    }


}
