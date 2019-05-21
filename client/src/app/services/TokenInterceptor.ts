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
        request = request.clone({
             headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
    }
    return next.handle(request).pipe(tap(
        (succes) => {
        },
        (error: any) => {
            if(error.status === 401) {
                this.loginService.logout();
                this.router.navigate(['/'])
            }
        }
    ))
  }
}