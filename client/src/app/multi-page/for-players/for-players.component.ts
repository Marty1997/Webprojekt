import { Component, OnInit } from '@angular/core';
import { loginService } from 'src/app/services/loginService';

@Component({
  selector: 'app-for-players',
  templateUrl: './for-players.component.html',
  styleUrls: ['./for-players.component.css']
})
export class ForPlayersComponent implements OnInit {
  isContentOpen: boolean = false;
  isPlayer: boolean;
  constructor(private loginService: loginService) { }

  ngOnInit() {
    if(this.loginService.typeOfLogin == 'Player') {
      this.isPlayer = true;
    }
  }
}
