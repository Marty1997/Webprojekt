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
  sum = 4;
  
  constructor(private searchService: searchService, private router: Router) {
    this.playerList = this.searchService.searchForPlayersResult;
    //this.addItems(0, this.sum);
    // if(!this.searchService.isBackward) {
    //   console.log("NgOnInit i if");
    //   for (let i = 0; i < this.searchService.searchForPlayersResult.length && i < 5; i++) {
    //     this.playerList.push(this.searchService.searchForPlayersResult[i]);
    //     this.searchService.scrollCount++
    //   }
    //   console.log(this.searchService.scrollCount);
    // }
    // else {console.log("NgOnInit i else");
    //   for (let i = 0; i < this.searchService.searchForPlayersResult.length && i < this.searchService.scrollCount - 2; i++) {
    //     this.playerList.push(this.searchService.searchForPlayersResult[i]);

    //   }
    // }
    console.log(this.playerList);
  }

  addItems(startIndex, endIndex) {
    console.log("AddItem");
    for (let i = this.playerList.length; i < this.sum && i < this.searchService.searchForPlayersResult.length; ++i) {
      this.playerList.push(this.searchService.searchForPlayersResult[i]);
    }
  }



  

  ngOnInit() {
    

  }

  ngAfterViewInit() {
    
    //this.searchService.isBackward = false;
  }

  onScroll(asd) {
    console.log(asd);
    // console.log("onScrolled");
    // console.log(this.playerList);
    // if(!this.searchService.isBackward) {
    //       if(this.playerList.length < this.searchService.searchForPlayersResult.length) {
    //   let len = this.playerList.length;
    //   for(let i = len; i <= len + 2; i++) {
    //     console.log("loop");
    //     this.playerList.push(this.searchService.searchForPlayersResult[i]);
    //     this.searchService.scrollCount++
    //   }

    // }
    // }
    console.log("scroll");
    const start = this.sum;
    this.sum += 2;
    this.addItems(start, this.sum);

    console.log(this.playerList); 
  }

  selectedPlayer(id: number) {
    this.searchService.getPlayerById(id).subscribe(
      (success:Player) => {
        this.searchService.player = success;
        this.searchService.isBackward = true;
        this.router.navigate(['/player-dashboard'])
      },
      error => {
        
      }
    ); 
  }
}
