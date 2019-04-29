import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { loginService } from "./loginService";


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public loginService: loginService, public router: Router) {}

    canActivate(): boolean {
      if (!this.loginService.isAuthenticated()) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
}
