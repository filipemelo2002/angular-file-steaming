import { Component, ElementRef, ViewChild } from '@angular/core';
import { CsvServiceService } from './csv-service.service';
import { Subscription, finalize } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'file-streaming';
  @ViewChild('fileInput') fileInput:ElementRef<HTMLInputElement>;

  uploader: Subscription | null;

  uploadProgress: number = 0;

  uploadedFiles: File[] = []
  constructor(private csvService: CsvServiceService) {

  }
  onSend() {
    if (!this.fileInput.nativeElement.files){
        return
    }

    const request = this.csvService.execute(this.fileInput.nativeElement.files).pipe(finalize(() => this.reset()))

    this.uploader = request.subscribe(event => {
      console.log(event)
      if (event.type === HttpEventType.UploadProgress) {
        if (event.loaded && event.total){
          this.uploadProgress = Math.round(100 * (event.loaded / event.total))
        }
      }
    })

  }

  cancelUpload() {
    this.uploader?.unsubscribe();
    this.reset();
  }

  reset() {
    if (this.fileInput.nativeElement.files){
      this.uploadedFiles.push(this.fileInput.nativeElement.files[0])
    }
    this.uploadProgress = 0;
    this.fileInput.nativeElement.files = null
    this.uploader= null;
  }
}
