import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-front-page-image',
  templateUrl: './front-page-image.component.html',
  styleUrls: ['./front-page-image.component.css']
})
export class FrontPageImageComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;

  constructor(private modalService: BsModalService) { }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openSecondModalNested(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
    this.modalRef.hide();
    this.modalRef = null;
  }

  ngOnInit() {
  }
    
  }
