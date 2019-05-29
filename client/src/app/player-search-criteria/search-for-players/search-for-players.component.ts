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
    this.playerList = this.searchService.searchForPlayersResult;

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
