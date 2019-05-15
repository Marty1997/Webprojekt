import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading-icon',
  templateUrl: './loading-icon.component.html',
  styleUrls: ['./loading-icon.component.css']
})
export class LoadingIconComponent {
  @Input() isLoading: boolean;

  constructor(private spinner: NgxSpinnerService) { }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }
}


