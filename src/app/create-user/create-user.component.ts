import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  constructor(private http: HttpClient, private router: Router) {
  }


  ngOnInit() {
    this.validateSession()
  }


  //URL
  url: string = 'http://localhost:4042/v1';

  //Objectos
  data: any = {};
  genderData: any = [];
  dataUser: any = {}
  genderOptions: any = [];
  options: any = {}

  //String
  messageError: string = ""
  idUserValue: string = ""
  nameValue: string = ""
  lastNameValue: string = ""
  dobValue: string = ""
  selectedGender: string = ""
  emailValue: string = ""
  mobilePhoneValue: string = ""
  creationDate: string = ""
  idStatusUser: string = ""
  lastDateOfEntry: string = ""
  accessAttempts: string = ""
  currentSession: string = ""
  lastPasswordChangeDate: string = ""
  requiresChangingPassword: string = ""
  photo: string = ""
  fecmod: string = ""
  usermod: string = ""
  userCreation: string = ""
  idBranch: string = ""
  modificationDate: string = ""
  userModification: string = ""


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
    console.log("valida Sesion")
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      console.log("activo")
      this.genderService()
    } else {
      this.router.navigateByUrl("/")
    }
  }




  //finaliza la sesion
  revoke() {
    console.log("salida")
    console.log(this.dataUser.session)
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
      console.log(response)
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


  //creacion de usuario
  create() {

    this.creationDate = new Date().toISOString();
    const formData = {
      idUser: this.idUserValue,
      name: this.nameValue,
      lastName: this.lastNameValue,
      dob: this.dobValue,
      idGender: this.selectedGender,
      email: this.emailValue,
      mobilePhone: this.mobilePhoneValue,
      idStatusUser: 1,
      lastDateOfEntry: null,
      accessAttempts: 0,
      currentSession: null,
      lastPasswordChangeDate: null,
      requiresChangingPassword: 1,
      photo: null,
      fecmod: null,
      usermod: null,
      userCreation: this.dataUser.user,
      creationDate: this.creationDate,
      idBranch: 1,
      modificationDate: null,
      userModification: null,
    }

    if (!this.buttonClicked) {
      this.buttonClicked = true;
      this.showSpinner = true;
      this.http.post(`${this.url}/createUser`, formData)
        .pipe(
          catchError((error: any) => {
            console.error('Error en la solicitud:', error);
            this.buttonClicked = false; // Esto sirve para que el boton se restablesca porque si lo quito se envian dos veces el correo porque el boton queda activo
            return [];
          })
        )
        .subscribe((response: any) => {
          if (response.code === '0') {
            console.log('Usuario creado exitosamente.');
            alert("Usuario creado exitosamente.")
            this.showSpinner = false;
            this.router.navigateByUrl("/userM")
            this.ServiceSaveImage();
          } else {
            this.showSpinner = false;
            console.error('Error al crear el usuario:', response.message);
            alert(response.message)
          }
          this.buttonClicked = false;
        });
    }
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
      const idUser = this.idUserValue; // Reemplaza esto con el ID real del usuario
      //const file = this.fileInput.nativeElement.files[0];
      //console.log(this.file2)
      console.log(idUser)
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
    console.log(response);
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
    return this.http.get<any>(this.url + "/gender", httpOptions).pipe(
      catchError(e => "1")
    )
  }

  ResponseGender(response: any) {
    this.genderData = response;
  }

}

