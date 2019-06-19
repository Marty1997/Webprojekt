import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
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
  scrollPosition: number [] = [];
  
  constructor(private searchService: searchService, private router: Router,private scroller: ViewportScroller) {
    

  }


  ngOnInit() {
    this.playerList = this.searchService.searchForPlayersResult;
    setTimeout(() => {
      if(this.searchService.scrollPosition1 != undefined && this.searchService.scrollPosition2 != undefined) {
        this.scroller.scrollToPosition([this.searchService.scrollPosition1, this.searchService.scrollPosition2]);
      }
      this.searchService.scrollPosition1 = undefined;
      this.searchService.scrollPosition2 = undefined;
    }, 100);

  }

  

  selectedPlayer(id: number) {
    this.scrollPosition = this.scroller.getScrollPosition();
    this.searchService.scrollPosition1 = this.scrollPosition[0];
    this.searchService.scrollPosition2 = this.scrollPosition[1];

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
