import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { loginService } from "./loginService";
import { errorService } from "./errorService";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public loginService: loginService, private router: Router, private errorService: errorService) {}
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
            else if(error.status === 500) {
              this.errorService.numberOfError = 500;
              this.router.navigate(['error']);
            }
            else if(error.status === 404) {
              this.errorService.numberOfError = 404;
              this.router.navigate(['error']);
            }
        }
    ))
  }
}