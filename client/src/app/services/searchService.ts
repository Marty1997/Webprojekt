import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SearchCriteria } from '../models/searchCriteria.model';

@Injectable()
export class searchService {
  searchForPlayersResult: Player[] = [];
  p1: Player = new Player();
  p2: Player = new Player();

  constructor(private http: HttpClient) {
    this.p1.id = 1;
    this.p1.firstName = 'Rune';
    this.p1.lastName = 'G'
    this.p1.day = '24';
    this.p1.month = '07';
    this.p1.year = '1995';
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
    this.p2.day = '24';
    this.p2.month = '07';
    this.p2.year = '1995';
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
    let url = "web api metode";
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
}
