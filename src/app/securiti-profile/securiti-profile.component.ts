import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

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

  constructor( private router: Router) { }

  ngOnInit() {
  }


  onPhotoSelected(event: HtmlInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      // image preview
      const reader = new FileReader();
      if(this.photoSelect!=null){
        reader.onload = e => this.photoSelect = reader.result;
        reader.readAsDataURL(this.file);
      }
    }
  }
/*  uploadPhoto(title: HTMLInputElement, description: HTMLTextAreaElement) {
    this.photoService
      .createPhoto(title.value, description.value, this.file)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate(['/photos'])
        },
        err => console.log(err)
      );
    return false;
  }*/
}
