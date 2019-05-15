import { Injectable } from '@angular/core'
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient, HttpResponseBase, HttpResponse } from '@angular/common/http';

@Injectable()

export class uploadFilesService {

  imagePath: string = "";
  videoPath: string = "";

  constructor(private http: HttpClient) {}

  uploadFile = (files) => {

    let url = "https://localhost:44310/api/Upload";
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.http.post(url, formData, {reportProgress: true, observe: 'response'})
  }

  createPath = (serverPath: string, type: string) => {
    serverPath = serverPath.replace(/[{}]/g, "").substring(9).slice(1, -1);;

    if(type === 'image') {
      this.imagePath = ("https:" + "\\\\" + "localhost:44310" + "\\" + serverPath);
    }
    if(type === 'video') {
      this.videoPath = ("https:" + "\\\\" + "localhost:44310" + "\\" + serverPath);
    }
  }
}