// src/app/auth/role-guard.service.ts
import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { loginService } from "../services/loginService";
import decode from "jwt-decode";

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public loginService: loginService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // // this will be passed from the route config
    // // on the data property
    // const expectedRole = route.data.expectedRole;
    // const token = localStorage.getItem("token");
    // // decode the token to get its payload
    // const tokenPayload = decode(token);
    // if (!this.loginService.isAuthenticated() || tokenPayload.role !== expectedRole) {
    //   this.router.navigate(['/']);
    //   return false;
    // }
    return true;
  }
}
