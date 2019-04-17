import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-front-page-image',
  templateUrl: './front-page-image.component.html',
  styleUrls: ['./front-page-image.component.css']
})
export class FrontPageImageComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  isVisible: boolean = true;

  playerRegistrationModal: BsModalRef;
  optional: String = ' Optional';
  required: String = ' Required';

  constructor(private modalService: BsModalService) { }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.isVisible = false;
  }

  openSecondModalNested(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
    this.modalRef.hide();
    this.modalRef = null;
  }

  openPlayerRegistrationModal(template: TemplateRef<any>) {
    this.playerRegistrationModal = this.modalService.show(template);
    this.modalRef.hide();
    this.modalRef = null;
  }

  @HostListener('backdrop-click', ['$event'])
  testing123() {
    this.isVisible = true;
  }

  ngOnInit() {
  }
    
  }
