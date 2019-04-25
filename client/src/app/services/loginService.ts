//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Injectable()

export class loginService {
  playerLoggedIn = false;
  clubLoggedIn = false;
  token: string;

  constructor(private http: HttpClient) {}

  revocerPassword(email: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, email);
  }

  loginUser(form: NgForm) {
    let url = "https://localhost:44310/api/authenticate/";

    return this.http.post(url, form.value);
  }

}