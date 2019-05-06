import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player.model';
import { searchService } from '../services/searchService';

@Component({
  selector: 'app-search-for-players',
  templateUrl: './search-for-players.component.html',
  styleUrls: ['./search-for-players.component.css'],
  providers: [searchService]
})
export class SearchForPlayersComponent implements OnInit {

  playerList: Player[] = [];
  p1: Player = new Player();
  p2: Player = new Player();
  constructor(private searchService: searchService) {}

  ngOnInit() {
    this.playerList = this.searchService.searchForPlayersResult;
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

    this.playerList.push(this.p1);

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

    this.playerList.push(this.p2);
  }

}
