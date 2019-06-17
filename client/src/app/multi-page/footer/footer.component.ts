import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getFullYear();
  privacyPolicyModal: BsModalRef | null;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openPolicyModalRef(template: TemplateRef<any>) {
    this.privacyPolicyModal = this.modalService.show(template, {class: 'customModalForPrivacyPolicy'});
  }

  

}
