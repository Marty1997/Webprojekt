import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";


@Injectable()
export class searchService {
  searchForPlayersResult: Player[] = [];
  player: Player;
  searchForClubsResult: Club[] = [];
  club: Club;
  scrollPosition1: number;
  scrollPosition2: number;

  constructor(private http: HttpClient) {
    this.player = new Player();
    this.club = new Club();
  }

  searchForPlayers(searchCriteria: any) {
    console.log(searchCriteria);
    let url = "https://localhost:44310/api/Player/SearchPlayers/";
    const params = new HttpParams({fromObject: searchCriteria});
    console.log(params);
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
