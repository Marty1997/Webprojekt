import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SearchCriteria } from '../models/searchCriteria.model';
import { ClubSearchCriteria } from '../models/clubSearchCriteria.model';
import { JobPosition } from '../models/jobPosition';

@Injectable()
export class searchService {
  searchForPlayersResult: Player[] = [];
  player: Player;
  searchForClubsResult: Club[] = [];
  club: Club;

  p1: Player = new Player();
  p2: Player = new Player();
  c1: Club = new Club();
  c2: Club = new Club();
  jobPos: JobPosition = new JobPosition();
  jobPos2: JobPosition = new JobPosition();
  jobPos3: JobPosition = new JobPosition();
  jobPos4: JobPosition = new JobPosition();

  constructor(private http: HttpClient) {
    this.player = new Player();
    this.club = new Club();
    // p1 & p2 er test objekter indtil backend bliver lavet
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

    //this.searchForPlayersResult.push(this.p1);

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
    //this.searchForPlayersResult.push(this.p2);

    this.jobPos.position = "Left Wing";
    this.jobPos2.position = "Left Back";
    this.jobPos3.position = "Playmaker";
    this.jobPos4.position = "Pivot";

    this.c1.id = 1;
    this.c1.country = "Denmark";
    this.c1.league = "First League";
    this.c1.trainer = "Rasmus Hansen";
    this.c1.jobPositionsList.push(this.jobPos);
    this.c1.jobPositionsList.push(this.jobPos2);
    this.c1.jobPositionsList.push(this.jobPos3);
    this.c1.jobPositionsList.push(this.jobPos4);
    this.searchForClubsResult.push(this.c1);

    this.c2.id = 2;
    this.c2.country = "Sweden";
    this.c2.league = "Third League";
    this.c2.trainer = "Jävla Fitta";
    this.c2.jobPositionsList.push(this.jobPos);
    this.c2.jobPositionsList.push(this.jobPos2);
    this.c2.jobPositionsList.push(this.jobPos3);
    this.c2.jobPositionsList.push(this.jobPos4);
    this.c2.jobPositionsList.push(this.jobPos2);
    this.c2.jobPositionsList.push(this.jobPos3);
    this.c2.jobPositionsList.push(this.jobPos4);
    this.searchForClubsResult.push(this.c2);
  }

  searchForPlayers(searchCriteria: SearchCriteria) {
    let url = "https://localhost:44310/api/Player/SearchPlayers/";
    console.log(searchCriteria);
    return this.http.post(url, searchCriteria);
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
    );
  }

  searchForClubs(searchCriteria: ClubSearchCriteria) {
    let url = "web api metode";
    return this.http.post(url, searchCriteria).subscribe(
      (success) => {
        console.log(success);
        // this.searchForClubsResult = success;
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  getClubById(club: Club) {
    let url = "https://localhost:44310/api/Club/GetById/";
    return this.http.post(url, club).subscribe(
      (success) => {
        console.log(success);
        this.club = this.club.buildClub(success, club);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
