import { Injectable } from '@angular/core';
import { Trans } from '../shared/trans';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class TransService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

    // adding new customer cart transaction to database on the server
    addTrans(trans: Trans): Observable<Trans> {
      return this.http.post(baseURL + '/trans', trans)
        .catch(error => this.processHttpmsgService.handleError(error));
    }

}
