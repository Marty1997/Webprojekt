//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Club } from '../models/club.model';
import { Player } from '../models/player.model';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()

export class loginService {
  typeOfLogin: string;
  token: string;
  clubInSession: Club;
  playerInSession: Player;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
    this.tokenStillValid();
  }

  private tokenStillValid() {
    if(this.isAuthenticated()) {
      this.token = localStorage.getItem('token');
      this.typeOfLogin = localStorage.getItem('typeOfLogin');
    }
    else {
      this.logout();
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return true;
    return !this.jwtHelper.isTokenExpired(token);
  }

  revocerPassword(email: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, email);
  }

  loginUser(form: NgForm) {
    let url = "https://localhost:44310/api/authenticate/";
    
     return this.http.post(url, form.value).subscribe(
      (succes:any) => {
        console.log(succes);
        if(succes.isPlayer) {
          this.typeOfLogin ="Player";
          this.token = succes.token;
          this.playerInSession = succes.player;
          localStorage.setItem('typeOfLogin', this.typeOfLogin);
          localStorage.setItem('token', this.token);
        }
        else if (succes.isClub) {
          this.typeOfLogin = "Club";
          this.token = succes.token;
          this.clubInSession = succes.club;
          localStorage.setItem('typeOfLogin', this.typeOfLogin);
          localStorage.setItem('token', this.token);
        }
      },
      (error) => {
      }
   );
  }

  logout() {
    // remove token and bool from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('typeOfLogin');
    this.typeOfLogin = "";
    this.clubInSession = null;
    this.playerInSession = null;
}

}