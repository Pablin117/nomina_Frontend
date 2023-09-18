import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-securiti-profile',
  templateUrl: './securiti-profile.component.html',
  styleUrls: ['./securiti-profile.component.css']
})
export class SecuritiProfileComponent implements OnInit {
  photoSelect : string | ArrayBuffer | null =null;
  file: File | null =null;

  constructor( private http: HttpClient) { }
  DataUser : any ={};
  file2 : any
  ngOnInit() {
    this.DataUser = localStorage.getItem("data");
    this.DataUser = JSON.parse(this.DataUser)
  }

  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;

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

  saveImage1(idUser: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUser', idUser);

    return this.http.post(`http://localhost:4042/v1/saveImage`, formData);
  }

  saveImage() {
    if (this.imageSrc) {
      const idUser = this.DataUser.user; // Reemplaza esto con el ID real del usuario
      const file = this.fileInput.nativeElement.files[0];

      this.saveImage1(idUser, file).subscribe(
        (response) => {
          // La imagen se ha guardado con éxito, maneja la respuesta aquí
          alert("No se guardo la imagen")
          //console.log('Imagen guardada con éxito:', response);
        },
        (error) => {
          // Maneja errores aquí
          alert("Se guardo la imagen")
          //console.error('Error al guardar la imagen:', error);
        }
      );
    }
  }

}
