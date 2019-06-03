//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Club } from '../models/club.model';
import { Player } from '../models/player.model';
import { Router } from "@angular/router";
import decode from "jwt-decode";


@Injectable()

export class loginService {
  typeOfLogin: string;
  refreshValue: boolean = false;
  clubInSession: Club;
  playerInSession: Player;

  constructor(private http: HttpClient, public router: Router) {
    console.log("Constructor");
    this.isAuthenticated();
    this.clubInSession = new Club();
    this.playerInSession = new Player();
  }

  //Helping method for loginService constructor to check if old 
  //token from login is still valid when visiting the site
  public isAuthenticated() {
    if(this.tokenStillValid()) {
      var info = this.getDecodeToken();
      this.typeOfLogin = info.role;
      this.refreshValue = true;
      if(info.role == "Player") {
        this.router.navigate(['player-dashboard'])
      }
      else {
        this.router.navigate(['club-dashboard'])
      }
    }
    else {
      this.logout();
    }
  }

  //Check if token exists and is expired 
  public tokenStillValid(): boolean {
    const token = this.getToken();
    if (token != null) {   
      const now = Date.now() / 1000;
      let decodeToken = decode(token);
      if (decodeToken.exp < now) {
        this.logout()
        return false;
      }
      return true;
    }
    return false;
  }

  public LoginUserIfValidTokenOnRefresh() { 
    let url = "https://localhost:44310/api/authenticate/RefreshUserWithValidToken/";
    return this.http.get(url).subscribe(
      (succes:any) => {      
        if(succes.isPlayer) {
          this.setupPlayerLogin(succes);
        }
        else if(succes.isClub) {
          this.setupClubLogin(succes);  
        }
      },
      error => {
        console.log("LoginUserIfValidTokenOnRefresh failed");
          this.logout();
      })
  }

  revocerPassword(email: string) {
    let url = "https://localhost:44310/api/email/"
        const body = {
            email: email,
            message: "lkmasdlkmasdlmk"
        }
    return this.http.post(url, body);
  }

  loginUser(form: NgForm) {
    let url = "https://localhost:44310/api/authenticate/";
     return this.http.post(url, form.value);
  }

  setupPlayerLogin(succes: any) {
    this.typeOfLogin = "Player";
    const token = this.getToken();
    if(token == null) {
      localStorage.setItem("token", succes.token);
    }
    this.playerInSession = this.playerInSession.buildPlayer(succes, this.playerInSession);
  }

  setupClubLogin(succes: any) {
    this.typeOfLogin = "Club";
    const token = this.getToken();
    if(token == null) {
      localStorage.setItem('token', succes.token);
    }
    this.clubInSession = this.clubInSession.buildClub(succes, this.clubInSession);
    console.log(this.clubInSession);

  }

  logout() {
    // remove token from local storage to log user out
    console.log("Logget ud"),
    localStorage.removeItem('token');
    this.typeOfLogin = "";
    this.clubInSession = new Club();
    this.playerInSession = new Player();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getDecodeToken() {
    const token = this.getToken();
    if(token != null) {
      let decodeToken = decode(token);
      var info = {
      role: decodeToken.role,
      id: decodeToken.unique_name
    };
    return info;
    }

  }
}