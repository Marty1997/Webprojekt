import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";

@Injectable()
export class registerService {
  constructor(private http: HttpClient) {}

  registerPlayer(player: Player) {
    let url = "WEB API controller metode";
    return this.http.post(url, player);
  }

  registerClub(club: Club) {
    let url = "WEB API controller metode";
    return this.http.post(url, club);
  }

  sendConfirmationEmail(playerEmail: string) {
    let url = "WEB API controller metode";
    return this.http.post(url, playerEmail);
  }
}
