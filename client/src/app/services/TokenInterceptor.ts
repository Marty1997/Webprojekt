import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { loginService } from "./loginService";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public loginService: loginService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    if (token != null) {
      console.log("set header til token" + token)
        request = request.clone({
             headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
    }
    return next.handle(request).pipe(tap(
        (succes) => {
            console.log("Serveren bekræfter valid token")
        },
        (error: any) => {
            if(error.status === 401) {
              console.log("Fejl i din token header")
                this.loginService.logout();
                this.router.navigate(['/'])
            }
        }
    ))
  }
}