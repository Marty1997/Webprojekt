import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-front-page-navbar',
  templateUrl: './front-page-navbar.component.html',
  styleUrls: ['./front-page-navbar.component.css'],
})
export class FrontPageNavbarComponent implements OnInit {
  
  @Input() childExample: string;
  navbarCollapse = true;
  @Output() childSmoothScroll = new EventEmitter<string>();

  constructor() {  }

  smoothScroll(destination: string) {
    this.childSmoothScroll.next(destination);
  }

  toggleNavbarCollapse() {
      this.navbarCollapse = !this.navbarCollapse;
  }

  ngOnInit() {
  }

  

}
