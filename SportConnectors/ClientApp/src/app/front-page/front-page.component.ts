import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {
  
  
  constructor() {
  }

  SmoothScroll(destination: string) {
    const element = document.querySelector(destination);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit() {
  }
}
