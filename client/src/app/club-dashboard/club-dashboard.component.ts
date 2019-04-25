import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-club-dashboard',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClubDashboardComponent implements OnInit {

  myInterval = 3000;
  slides = [
    {image: 'assets/Images/Håndboldbane.jpg'},
    {image: 'assets/Images/omklædning.jpg'},
    {image: 'assets/Images/Styrke.jpg'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
