import { ErrorHandler, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class ErrorsHandler implements ErrorHandler {
  handleError(error: Error | HttpErrorResponse) {
     // Do whatever you like with the error (send it to the server?)
     // And log it to the console
     console.log(error);
     if (error instanceof HttpErrorResponse) {
        // Handle Http Error (error.status === 403, 404...)
      console.log("lkmad");
      }
     // Handle Client Error (Angular Error, ReferenceError...)     
     console.error('It happens: ', error);
  }
}