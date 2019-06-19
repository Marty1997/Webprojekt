import {Component, Injectable, Input} from '@angular/core';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-update-message',
  templateUrl: './update-message.component.html',
  styleUrls: ['./update-message.component.css']
})

export class UpdateMessageComponent {

   @Input() showMessage: boolean;

   constructor(public snackBar: MatSnackBar) {}

   openSnackBar(message: string, action: string) {
      if(this.showMessage) {
        this.showMessage = false;
        this.snackBar.open(message, action, {
          duration: 2000,
       });
       
      }
   } 
}   