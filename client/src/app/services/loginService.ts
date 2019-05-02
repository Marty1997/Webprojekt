//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Club } from '../models/club.model';
import { Player } from '../models/player.model';
import { Router } from "@angular/router";
import decode from "jwt-decode";
import { getToken } from '@angular/router/src/utils/preactivation';


@Injectable()

export class loginService {
  typeOfLogin: string;
  token: string;
  clubInSession: Club;
  playerInSession: Player;

  constructor(private http: HttpClient, public router: Router) {
    this.isAuthenticated();
    this.clubInSession = new Club();
    this.playerInSession = new Player();
  }

  //Helping method for loginService constructor to check if old 
  //token from login is still valid when visiting the site
  public isAuthenticated() {
    if(this.tokenStillValid()) {
        this.LoginUserIfValidTokenOnRefresh();
    }
    else {
      this.logout();
    }
  }

  //Check if token exists and is expired 
  public tokenStillValid(): boolean {
    const token = this.getToken();
    // Check whether the token is expired and return true or false
    if (token) {   
      console.log("Still valid inde i token");
      const now = Date.now() / 1000;
      let decodeToken = decode(token);
      if (decodeToken.exp < now) {
        console.log("Token udløbet")
        this.logout()
        return false;
      }
      return true;
    }
    return false;
  }

  LoginUserIfValidTokenOnRefresh() { 
    this.token = this.getToken();
    let decodeToken = decode(this.token);
    var info = {
      role: decodeToken.role,
      id: decodeToken.unique_name
    };
    let url = "https://localhost:44310/api/authenticate/RefreshUserWithValidToken/";
    this.http.post(url, info).subscribe(
      (succes:any) => {      
        console.log(succes);
        if(succes.isPlayer) {
          this.setupPlayerLogin(succes);
          this.router.navigate(['/player-dashboard'])
        }
        else if(succes.isClub) {
          this.setupClubLogin(succes);
          this.router.navigate(['/club-dashboard'])
        }
      },
      error => {
        console.log("LoginUserIfValidTokenOnRefresh failed");
          this.logout();
      })
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
    this.playerInSession = this.playerInSession.buildPlayer(succes, this.playerInSession);

    localStorage.setItem("token", this.token);
  }

  setupClubLogin(succes: any) {
    this.typeOfLogin = "Club";
    this.token = succes.token;
   
    this.clubInSession = this.clubInSession.buildClub(succes, this.clubInSession);
  

    localStorage.setItem('token', this.token);
  }

  logout() {
    // remove token from local storage to log user out
    console.log("Logget ud"),
    localStorage.removeItem('token');
    this.typeOfLogin = "";
    this.clubInSession = null;
    this.playerInSession = null;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }


}