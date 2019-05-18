import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SearchCriteria } from '../models/searchCriteria.model';
import { ClubSearchCriteria } from '../models/clubSearchCriteria.model';

@Injectable()
export class searchService {
  searchForPlayersResult: Player[] = [];
  scrollCount: number = 0;
  player: Player;
  searchForClubsResult: Club[] = [];
  club: Club;
  isBackward: boolean = false;

  constructor(private http: HttpClient) {
    this.player = new Player();
    this.club = new Club();
  }

  searchForPlayers(searchCriteria: any) {
    let url = "https://localhost:44310/api/Player/SearchPlayers/";
    const params = new HttpParams({fromObject: searchCriteria});
    return this.http.get(url, {params: params});
  }

  getPlayerById(id: number) {
    const params = new HttpParams().set('id', id.toString());
    let url = "https://localhost:44310/api/Player/GetById/";
    return this.http.get(url, {params: params});
  }

  searchForClubs(searchCriteria: any, id: number) {
    const params = new HttpParams({fromObject: searchCriteria}).set('id', id.toString());
    let url = "https://localhost:44310/api/Club/SearchForClubs/";
    return this.http.get(url, {params: params});
  }

  getClubById(id: number) {
    const params = new HttpParams().set('id', id.toString());
    let url = "https://localhost:44310/api/Club/GetById/";
    return this.http.get(url, {params: params});
  }
}
