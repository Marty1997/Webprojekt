import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  
  constructor(private searchService: searchService, private router: Router) {
    
  }

  ngOnInit() {

        //this.playerList = this.searchService.searchForPlayersResult;
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());
    // this.searchService.searchForPlayersResult.push(new Player());

    console.log(this.playerList);

  }

  onScroll() {
    
    console.log(this.playerList);
    if(this.playerList.length < this.searchService.searchForPlayersResult.length) {
      let len = this.playerList.length;
      for(let i = len; i <= len + 2; i++) {
        this.playerList.push(this.searchService.searchForPlayersResult[i]);
      }
    }
  }

  selectedPlayer(id: number) {
    this.searchService.getPlayerById(id).subscribe(
      (success:Player) => {
        this.searchService.player = success;
        this.router.navigate(['/player-dashboard'])
      },
      error => {
        
      }
    ); 
  }
}
