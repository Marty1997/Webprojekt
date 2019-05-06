import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SearchCriteria } from '../models/searchCriteria.model';

@Injectable()
export class searchService {
  constructor(private http: HttpClient) {}
  searchForPlayersResult: Player[] = [];

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
