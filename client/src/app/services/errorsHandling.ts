import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { loginService } from "./loginService";
import { Router } from "@angular/router";
@Injectable()

export class ErrorsHandler implements ErrorHandler {
   constructor(private injector: Injector) {}
  handleError(error: Error) {
      let service = this.injector.get(loginService);
    //  // Handle Client Error (Angular Error, ReferenceError...) 
      if(error.name == 'TypeError' || 'SyntaxError' || 'ReferenceError' || 'RangeError' || 'InternalError') {
           service.logout(); 
      }

  }
}