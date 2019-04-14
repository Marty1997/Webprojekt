import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css']
})
export class PlayerDashboardComponent implements OnInit {
  isFirstOpen = true;
  constructor() { }

  ngOnInit() {
  }

}
