import {Component, OnInit, ViewChild} from '@angular/core';
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
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)

    this.validateSession()
    this.genderService();

  }


  showSuccessMessage = false;

  url: string = 'http://localhost:4042/v1';
  messageError: string = '';
  data: any = {};
  routes: any = {};
  return: any = {};
  genderData: any = [];
  idUserValue: string = ''
  nameValue: string = ''
  lastNameValue: string = ''
  dobValue: string = ''
  selectedGender: string = '';
  emailValue: string = ''
  mobilePhoneValue: string = ''
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
  userModification: string = "";
  buttonClicked = false;
  header: boolean = true
  dataUser: any = {}
  file: File | null =null;
  file2 : any
  genderOptions: any = [];
  VarId: any = {};
  showSpinner: boolean = false;



  validateSession() {
    if (this.dataUser != null) {
      console.log("activo")
    } else {
      this.router.navigateByUrl("/")
    }
  }

  revoke() {
    console.log("salida")
    console.log(this.dataUser.session)
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }

  back() {
    console.log("back")
    this.router.navigateByUrl("/userM")
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

  backWelcome() {

      this.router.navigateByUrl("/userM")
  }

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

    };



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
            this.saveImage();
          } else {
            this.showSpinner = false;
            console.error('Error al crear el usuario:', response.message);
            alert(response.message)
          }
          this.buttonClicked = false;
        });
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
      this.file2=selectedFile
    }
  }

  selectImage() {
    // Hacer clic en el input de tipo archivo para abrir el cuadro de diálogo de selección de archivo
    this.fileInput.nativeElement.click();
  }
  deleteImages(){
    this.imageSrc = null;
  }
  deletBack(){
    this.back()
    this.deleteImages()
  }
  saveImage1(idUser: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUser', idUser);

    return this.http.post(`http://localhost:4042/v1/saveImage`, formData);
  }

  saveImage() {
    if (this.imageSrc) {
      const idUser = this.idUserValue; // Reemplaza esto con el ID real del usuario
      const file = this.fileInput.nativeElement.files[0];
      console.log(idUser)
      this.saveImage1(idUser, file).subscribe(
        (response:any) =>this.ResponseImages(response)

      );
    }
  }

  ResponseImages(response: any) {
    console.log(response);
  }
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
    //console.log("Se obtuvieron los generos");
    //console.log(this.genderData[0])
  }

}

