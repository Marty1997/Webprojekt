import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { loginService } from 'src/app/services/loginService';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-front-page-image',
  templateUrl: './front-page-image.component.html',
  styleUrls: ['./front-page-image.component.css'],
  providers: [ loginService ]
})
export class FrontPageImageComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef | null;
  modalRefRecoverPassword: BsModalRef;
  isVisible: boolean = true;
  recoverPasswordResult : string = "Email has been sent";

  playerRegistrationModal: BsModalRef;
  clubRegistrationModal: BsModalRef;

  constructor(private modalService: BsModalService, private loginService: loginService) { }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.isVisible = false;
  }

  openSecondModalNested(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {class: 'customModal'});
    this.modalRef.hide();
    this.modalRef = null;
  }

  openRecoverPasswordModal(template: TemplateRef<any>) {
    this.modalRefRecoverPassword = this.modalService.show(template, {class: 'customModal'});
  }
  
  recoverPasswordClicked(form : NgForm) {
    // this.loginService.revocerPassword(form.value.email).subscribe(
    //   (succes) =>(this.recoverPasswordResult = /*Tildel værdien fra succes beskden som kommer fra server*/""), 
    //   (error) => (this.recoverPasswordResult= "asd" + error /* TIldel recoverPasswordREsult værdien fra error beskden fra serveren*/),
    //   () => (console.log("Completed")))
  }

  clubLogin(form: NgForm) {
    console.log(form.value.email);
    console.log(form.value.password);
    // this.loginService.clubLogin(form.value.email, form.value.password).subscribe(
    //   (succes)=>("a"),
    //   (error) => ("a"),
    //   () => ("a"))
  }

  playerLogin(form: NgForm) {
    console.log(form.value.email);
    console.log(form.value.password);
    // this.loginService.playerLogin(form.value.email, form.value.password).subscribe(
    //   (succes)=>("a"),
    //   (error) => ("a"),
    //   () => ("a"))
  }
  openPlayerRegistrationModal(template: TemplateRef<any>) {
    this.playerRegistrationModal = this.modalService.show(template);
    this.modalRef.hide();
    this.modalRef = null;
  }

  openClubRegistrationModal(template: TemplateRef<any>) {
    this.clubRegistrationModal = this.modalService.show(template);
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
