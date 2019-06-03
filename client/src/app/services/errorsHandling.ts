import { ErrorHandler, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class ErrorsHandler implements ErrorHandler {
  handleError(error: Error) {
     // Handle Client Error (Angular Error, ReferenceError...) 
     console.error('It happens: ', error);

  }
}