import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Injectable()

export class uploadFilesService {
  constructor(private http: HttpClient) {}

  uploadFile(file: any) {
    // upload file to the host file system ...
    
  }

}