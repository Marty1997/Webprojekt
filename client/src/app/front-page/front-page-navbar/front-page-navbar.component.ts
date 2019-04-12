import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';

@Component({
  selector: 'app-front-page-navbar',
  templateUrl: './front-page-navbar.component.html',
  styleUrls: ['./front-page-navbar.component.css'],
})
export class FrontPageNavbarComponent implements OnInit {
  
  @Input() childExample: string;
  navbarCollapse = true;

  constructor(private frontPage: FrontPageComponent) {  }

  SmoothScroll(destination: string) {
    this.frontPage.SmoothScroll(destination);
  }

  toggleNavbarCollapse() {
      this.navbarCollapse = !this.navbarCollapse;
  }

  ngOnInit() {
  }

  

}
