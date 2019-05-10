import { Injectable } from '@angular/core'
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient, HttpResponseBase, HttpResponse } from '@angular/common/http';

@Injectable()

export class uploadFilesService {

  imagePath: string = "";

  constructor(private http: HttpClient) {}

  uploadFile = (files) => {

    let url = "https://localhost:44310/api/Upload/UploadFile";
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(url, formData, {reportProgress: true, observe: 'response'})
  }

  uploadFiles = (files) => {
    
    let url = "https://localhost:44310/api/Upload/UploadFiles";
    let filesToUpload : File[] = files;
    const formData = new FormData();
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });

    return this.http.post(url, formData, {reportProgress: true, observe: 'response'})
  }

  createImgPath = (serverPath: string) => {
    serverPath = serverPath.replace(/[{}]/g, "").substring(9).slice(1, -1);;
    this.imagePath = ("https:" + "\\\\" + "localhost:44310" + "\\" + serverPath);
  }
}