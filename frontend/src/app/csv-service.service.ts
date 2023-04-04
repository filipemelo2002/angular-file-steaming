import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {

  constructor(private httpClient: HttpClient) { }

  execute(files: FileList ) {
    const formData = new FormData();
    formData.append('file', files[0]);
    return this.httpClient.post('http://localhost:3000/', formData, {reportProgress: true, observe: 'events', headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }})
  }
}
