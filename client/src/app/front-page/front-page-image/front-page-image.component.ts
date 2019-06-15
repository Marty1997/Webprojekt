import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { loginService } from 'src/app/services/loginService';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-front-page-image',
  templateUrl: './front-page-image.component.html',
  styleUrls: ['./front-page-image.component.css'],
  providers: []
})
export class FrontPageImageComponent implements OnInit {
  chooseRegisterModal: BsModalRef | null;
  loginModal: BsModalRef | null;
  modalRefRecoverPassword: BsModalRef;
  wrongEmailOrPassword : boolean = false;
  noConnection: boolean = false;
  serverError: boolean = false;
  recoverPasswordResult : boolean = false;
  clubRegistrationModal: BsModalRef;
  playerRegistrationModal: BsModalRef;
  isLoading: boolean = false;
  constructor(private modalService: BsModalService, private loginService: loginService,
    private router: Router) { }
  
  openModalRegister(template: TemplateRef<any>) {
    this.chooseRegisterModal = this.modalService.show(template);
  }

  openModalLogin(template: TemplateRef<any>) {
    this.loginModal = this.modalService.show(template, {class: 'customModal'});
  }

  openRecoverPasswordModal(template: TemplateRef<any>) {
    this.recoverPasswordResult = false;
    this.modalRefRecoverPassword = this.modalService.show(template, {class: 'customModal'});
  }
  
  recoverPasswordClicked(form : NgForm) {
    this.loginService.revocerPassword(form.value.email).subscribe(
      (succes) =>(this.recoverPasswordResult = true), 
      (error) => {
        if(error.error == "Failed") {
          this.recoverPasswordResult = true
        }
    })
  }

  closeAllModals() {
    this.loginModal.hide();
    this.loginModal = null;
    if(this.modalRefRecoverPassword != null) {
      this.modalRefRecoverPassword.hide();
      this.modalRefRecoverPassword = null;
    }
  }

  loginUser(form: NgForm) {
    this.noConnection = false;
    this.wrongEmailOrPassword = false;
    this.serverError = false;
    this.isLoading = true;
    this.loginService.loginUser(form).subscribe(
      (succes:any) => {
        this.isLoading = false;
        if(!succes) {
            this.wrongEmailOrPassword = true;
        }
        else {
          this.closeAllModals();
          if(succes.isPlayer) {
            this.loginService.setupPlayerLogin(succes);
            window.scrollTo(0, 0)
            this.router.navigate(['/player-dashboard'])
          }
          else if(succes.isClub) {
            this.loginService.setupClubLogin(succes);
            window.scrollTo(0, 0)
            this.router.navigate(['/club-dashboard'])
          }
        }
      },
      error => {
        this.isLoading = false;
        if(error.status == 0) {
          this.wrongEmailOrPassword = false;
          this.noConnection = true;
        }
        else if(error.error == "Failed") {
          this.serverError = true;
        }
      }
    )
    form.resetForm();
  }

  openPlayerRegistrationModal(template: TemplateRef<any>) {
    this.playerRegistrationModal = this.modalService.show(template);
    this.chooseRegisterModal.hide();
    this.chooseRegisterModal = null;
  }

  openClubRegistrationModal(template: TemplateRef<any>) {
    this.clubRegistrationModal = this.modalService.show(template);
    this.chooseRegisterModal.hide();
    this.chooseRegisterModal = null;
  }


  ngOnInit() {
    if(this.loginService.typeOfLogin == "Player") {
      this.router.navigate(['player-dashboard'])
    }
    else if(this.loginService.typeOfLogin == "Club") {
      this.router.navigate(['club-dashboard'])
    }
  }
}
