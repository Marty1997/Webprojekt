import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  loginIn = true;

  //Only here for prototype
  validate() {
    var inputValue = (<HTMLInputElement>document.getElementById('lol')).value;
    if(inputValue === "Abc321") {
      this.loginIn = true
    }
  }
}
