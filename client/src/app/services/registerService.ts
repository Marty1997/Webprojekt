import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";

@Injectable()
export class registerService {
  constructor(private http: HttpClient) {}

  registerPlayer(player: Player) {
    let url = "https://localhost:44310/api/Player";
    return this.http.post(url, player);
  }

  registerClub(club: Club) {
    let url = "https://localhost:44310/api/Club";
    return this.http.post(url, club);
  }

  checkIfEmailExists(email: string) {
    let url = "https://localhost:44310/api/email/"
    const params = new HttpParams().set('email', email);
    return this.http.get(url, {params: params});
  }

}
