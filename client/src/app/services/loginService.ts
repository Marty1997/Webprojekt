//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Club } from '../models/club.model';
import { Player } from '../models/player.model';

import decode from "jwt-decode";


@Injectable()

export class loginService {
  typeOfLogin: string;
  token: string;
  clubInSession = new Club();
  playerInSession: Player;

  constructor(private http: HttpClient) {
    this.tokenStillValid();
  }

  //Helping method for loginService constructor to check if old 
  //token from login is still valid when visiting the site
  private tokenStillValid() {
    if(this.isAuthenticated()) {
      this.token = localStorage.getItem('token');
      this.typeOfLogin = localStorage.getItem('typeOfLogin');
    }
    else {
      this.logout();
    }
  }

  //Check if token is expired
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const now = Date.now() / 1000;
    let decodeToken;
    // Check whether the token is expired and return
    // true or false
    if (token) {
      decodeToken = decode(token);
      if (decodeToken.exp < now) {
        console.log("Token udløbet")
        this.logout();
        return false;
      }
      return true;
    }
    return false;
  }

  revocerPassword(email: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, email);
  }

  loginUser(form: NgForm) {
    let url = "https://localhost:44310/api/authenticate/";
    
     return this.http.post(url, form.value);
  }

  setupPlayerLogin(succes: any) {
    this.typeOfLogin = "Player";
    this.token = succes.token;
    this.playerInSession = succes.player;
    localStorage.setItem("typeOfLogin", this.typeOfLogin);
    localStorage.setItem("token", this.token);
  }

  setupClubLogin(succes: any) {
    this.typeOfLogin = "Club";
    this.token = succes.token;
    this.clubInSession = succes.club;
    localStorage.setItem('typeOfLogin', this.typeOfLogin);
    localStorage.setItem('token', this.token);
  }

  logout() {
    // remove token and type from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('typeOfLogin');
    this.typeOfLogin = "";
    this.clubInSession = null;
    this.playerInSession = null;
}

}