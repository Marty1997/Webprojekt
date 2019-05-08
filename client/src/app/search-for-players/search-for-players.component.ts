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
  constructor(private searchService: searchService) {}

  ngOnInit() {
    this.playerList = this.searchService.searchForPlayersResult;
  }

}
