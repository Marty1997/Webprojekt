import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player.model';
import { searchService } from '../../services/searchService';

@Component({
  selector: 'app-search-for-players',
  templateUrl: './search-for-players.component.html',
  styleUrls: ['./search-for-players.component.css'],
  providers: []
})
export class SearchForPlayersComponent implements OnInit {

  playerList: Player[] = [];
  constructor(private searchService: searchService) {}

  ngOnInit() {
    console.log(this.searchService.searchForPlayersResult);
    this.playerList = this.searchService.searchForPlayersResult;
    console.log('Search-for-players list: ' + this.playerList);
  }

}
