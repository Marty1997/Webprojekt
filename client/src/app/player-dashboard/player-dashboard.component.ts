import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../models/player.model';
import { searchService } from '../services/searchService';

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css'],
  providers: [searchService]
})
export class PlayerDashboardComponent implements OnInit {
  isFirstOpen = true;
  constructor(private route: ActivatedRoute, private searchService: searchService) { }
  players: Player[] = this.searchService.searchForPlayersResult;
  player: Player = new Player();

  ngOnInit() {
    this.players.forEach((p: Player) => {
      if (p.id == this.route.snapshot.params.id) {
        this.player = p;
      }
    });
    console.log('Dashboard Players:' + this.players);
    console.log('Dashboard Player:' + this.player);
  }
}
