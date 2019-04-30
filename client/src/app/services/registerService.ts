import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";

@Injectable()
export class registerService {
  constructor(private http: HttpClient) {}

  registerPlayer(player: Player) {
    let url = "http://localhost:51298/api/Player";
    return this.http.post(url, player).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  registerClub(club: Club) {
    let url = "http://localhost:51298/api/Club";
    return this.http.post(url, club).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  sendConfirmationEmail(playerEmail: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, playerEmail).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }
}
