import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProcessHttpmsgService {

  constructor() { }

  public handleError (error: HttpErrorResponse | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error.error instanceof Error) {
      errMsg = error.error.message;
    } else {
      if (error.error.err.name) {
        errMsg = `${error.status} - ${error.error.status || ''} ${error.error.err.name}`;
      } else {
        errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
      }
    }
    return Observable.throw(errMsg);
  }
}
