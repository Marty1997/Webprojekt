import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SearchCriteria } from '../models/searchCriteria.model';
import { loginService } from './loginService';

@Injectable()
export class searchService {
  searchForPlayersResult: Player[] = [];
  player: Player;
  p1: Player = new Player();
  p2: Player = new Player();

  constructor(private http: HttpClient) {
    this.player = new Player();
    this.p1.id = 6;
    this.p1.firstName = 'Rune';
    this.p1.lastName = 'G'
    this.p1.day = 24;
    this.p1.month = 0o7;
    this.p1.year = 1995;
    this.p1.country = 'Denmark';
    this.p1.primaryPosition = 'Left Wing';
    // this.p1.contractStatus = 'Open for Offers';
    this.p1.height = 192;
    this.p1.weight = 90;
    this.p1.bodyfat = 22;
    this.p1.preferredHand = 'Both Hands';
    // this.p1.injuryStatus = 'Injured';

    this.searchForPlayersResult.push(this.p1);

    this.p2.id = 2;
    this.p2.firstName = 'Rune';
    this.p2.lastName = 'G'
    this.p2.day = 24;
    this.p2.month = 0o7;
    this.p2.year = 1995;
    this.p2.country = 'Denmark';
    this.p2.primaryPosition = 'Left Wing';
    // this.p2.contractStatus = 'Open for Offers';
    this.p2.height = 192;
    this.p2.weight = 90;
    this.p2.bodyfat = 22;
    this.p2.preferredHand = 'Both Hands';
    // this.p2.injuryStatus = 'Injured';

    this.searchForPlayersResult.push(this.p2);
  }

  searchForPlayers(searchCriteria: SearchCriteria) {
    let url = "https://localhost:44310/api/Player/SearchPlayers/";
    return this.http.post(url, searchCriteria).subscribe(
      (success) => {
        console.log(success);
        // this.searchForPlayersResult = success;
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  getPlayerById(player: Player) {
    let url = "https://localhost:44310/api/Player/GetById/";
    return this.http.post(url, player).subscribe(
      (success) => {
        console.log(success);
        this.player = this.player.buildPlayer(success, player);
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
