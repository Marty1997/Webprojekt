import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.css']
})
export class RegisterClubComponent implements OnInit {
  @Input() modalRef: any;

  constructor() { }

  ngOnInit() {
  }

}
