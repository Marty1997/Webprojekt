import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

  navbarBackground: string;

  constructor() { }

  ngOnInit() {
  }

  parentSmoothScroll(destination: string) {
    const element = document.querySelector(destination);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 50) {
      this.navbarBackground = '#f8f8f8';
    } else {
      this.navbarBackground = 'transparent';
    }
  }

  

}
