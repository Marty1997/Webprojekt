import {Component, Injectable, Input} from '@angular/core';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-update-message',
  templateUrl: './update-message.component.html',
  styleUrls: ['./update-message.component.css']
})

export class UpdateMessageComponent {

   @Input() showMessage: boolean;
   @Input() message: string;

   constructor(public snackBar: MatSnackBar) {}

   openSnackBar(action: string) {
        this.showMessage = false;
        this.snackBar.open(this.message, action, {
          duration: 2000,
          // verticalPosition: 'top',
          panelClass: ['verticalSnackBar']
       });
   } 
}   