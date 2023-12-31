import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  constructor(private http: HttpClient, private router: Router, private url:AppComponent) {
  }


  ngOnInit() {
    this.validateSession()
  }


  

  //Objectos
  data: any = {}
  genderData: any = []
  dataUser: any = {}
  genderOptions: any = []
  options: any = {}
  userDataCreate: any = {}
  locationsData: any = []

  //String



  //imagen
  file: any
  imageSrc: string | ArrayBuffer | null = null
  @ViewChild('fileInput') fileInput: any

  //boolean
  buttonClicked: boolean = false
  header: boolean = true
  showSpinner: boolean = false
  showSuccessMessage: boolean = false



  //valida la sesion
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.genderService()
      this.location()
    } else {
      this.router.navigateByUrl("/")
    }
  }



  addForm() {
    let formularioValido: any = document.getElementById("create");
    if (formularioValido.reportValidity()) {
      this.showSpinner = true
      this.userDataCreate.userCreation = this.dataUser.user
      this.RequestUserSave().subscribe(
        (response: any) => this.ResponseUserSave(response)
      )
    }

  }

  RequestUserSave() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.url.urlData + "/createUser", this.userDataCreate, httpOptions).pipe(
      catchError(e => "1")
    )
  }
  ResponseUserSave(response: any) {
    if (response.code == '0') {
      this.ServiceSaveImage();
      alert("Usuario creado exitosamente.")
      this.showSpinner = false;
      this.router.navigateByUrl("/userM")

    } else {
      this.showSpinner = false;
      alert(response.message)
    }

  }



  //obtien localization


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
    return this.http.get<any>(this.url.urlData + "/location", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  responseLocation(response: any) {

    this.locationsData = response
  }

  //funciones de seleccion de imagen

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

      this.saveImage(this.userDataCreate.idUser, this.file).subscribe(
        (response: any) => response = console.log("imagen guradada")

      );
    }
  }

  //Guarda la imagen
  saveImage(idUser: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUser', idUser);
    return this.http.post(this.url.urlData + `/saveImage`, formData);
  }


  //Servicio que obtiene los generos
  genderService() {
    this.RequestGender().subscribe(
      (response: any) => this.ResponseGender(response)
    )
  }
  RequestGender() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url.urlData + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseGender(response: any) {
    this.genderData = response;
  }



  //finaliza la sesion
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

      localStorage.removeItem("data")
      this.router.navigateByUrl("/")
      localStorage.clear()
    } else {
      alert(response.message)
      this.router.navigateByUrl("/")
      localStorage.clear()
    }

  }

  //banderas
  back() {
    this.router.navigateByUrl("/userM")
  }


}

