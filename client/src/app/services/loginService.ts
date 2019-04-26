//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Club } from '../models/club.model';
import { Player } from '../models/player.model';


@Injectable()

export class loginService {
  typeOfLogin: string;
  token: string;
  clubInSession: Club;
  playerInSession: Player;

  constructor(private http: HttpClient) {}

  revocerPassword(email: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, email);
  }

  loginUser(form: NgForm) {
    let url = "https://localhost:44310/api/authenticate/";
    
    this.http.post(url, form.value).subscribe(
      (succes:any) => {
        console.log(succes);
        if(succes.isPlayer) {
          this.typeOfLogin ="Player";
          this.token = succes.token;
          this.playerInSession = succes.player;
          localStorage.setItem('typeOfLogin', this.typeOfLogin);
          localStorage.setItem('token', this.token);
          return true;
        }
        else if (succes.isClub) {
          this.typeOfLogin = "Club";
          this.token = succes.token;
          this.clubInSession = succes.club;
          localStorage.setItem('typeOfLogin', this.typeOfLogin);
          localStorage.setItem('token', this.token);
          return true;
        }
      },
      (error) => {
        if(error.error == "Failed to authenticate") {
           return false
        }
        return false;
      }
   );
   return false;
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