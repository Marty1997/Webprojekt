import { Component, OnInit } from '@angular/core';
import { FrontPageComponent } from 'app/front-page/front-page.component';

@Component({
  selector: 'app-front-page-navbar',
  templateUrl: './front-page-navbar.component.html',
  styleUrls: ['./front-page-navbar.component.css']
})
export class FrontPageNavbarComponent implements OnInit {

  constructor(private frontPage: FrontPageComponent) { }

  SmoothScroll(destination: string) {
    this.frontPage.SmoothScroll(destination);
  }

  ngOnInit() {
  }

}
