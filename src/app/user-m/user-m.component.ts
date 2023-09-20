import {Component, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-m',
  templateUrl: './user-m.component.html',
  styleUrls: ['./user-m.component.css']
})
export class UserMComponent {
  //variables
  UsersData: any = [];
  url: String = "http://localhost:4042/v1"
  modify: boolean = false;
  add: boolean = false;
  tab: boolean = true;
  userDataCreate: any = {}
  userDataModify: any = {}
  locationsData: any = {};
  statusData: any = {};
  userModify: any = {};
  dataUser: any = {}
  VarModulo: any = [];
  VarName:any=[];
  header: boolean = true
  Return: any = {};
  file: File | null =null;
  file2 : any
  VarId: any = {};

  ngOnInit() {
    this.dataUser = localStorage.getItem("data");
    this.dataUser = JSON.parse(this.dataUser)
    this.User();
    this.validateSession()
  }
  constructor(private http: HttpClient,private router: Router) { }
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;

  validateSession(){
    if(this.dataUser != null){
    }else{
      this.router.navigateByUrl("/")
    }
  }

  User(){
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
  }

  Modify(modulo: any) {
    this.userModify = modulo
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false
    this.userDataModify = {}
    this.userDataCreate = {}
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
  }

  modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.userModify.name = this.userDataModify.name
      this.userModify.lastName = this.userDataModify.lastName
      this.userModify.idStatusUser =this.userDataModify.idStatusUser
      this.userModify.email =this.userDataModify.email
      this.userModify.mobilePhone =this.userDataModify.mobilePhone
      this.userModify.idBranch =this.userDataModify.idBranch
      this.userModify.userModification = this.dataUser.user
      this.RequestUserSaveM().subscribe(
        (response:any) => this.ResponseUserSaveM(response)
      )

    }
  }
  RequestUserSaveM() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put<any>(this.url + "/modifyUser/"+this.userModify.idUser, this.userModify,httpOptions).pipe(
      catchError(e => "1")
    )
    /*<button (click)="saveImage()" [disabled]="!imageSrc">Guardar Imagen</button>*/
  }
  ResponseUserSaveM(response: any) {
    if(response.code == 0){
      alert(response.message)
      this.VarId=this.userModify.idUser
      this.saveImage()
      this.deleteImages()
      this.back()
      this.ngOnInit()
    }else{
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
      const idUser = this.VarId; // Reemplaza esto con el ID real del usuario
      const file = this.fileInput.nativeElement.files[0];
      console.log(this.VarId)
      this.saveImage1(idUser, file).subscribe(
        (response) => {
          // La imagen se ha guardado con éxito, maneja la respuesta aquí
          //console.log('Imagen guardada con éxito:', response);
        },
        (error) => {
          // Maneja errores aquí
          //console.error('Error al guardar la imagen:', error);
        }
      );
    }
  }



}
