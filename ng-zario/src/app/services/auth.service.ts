import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../shared/security';

import { Observable } from 'rxjs/Observable';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { baseURL } from '../shared/baseurl';

@Injectable()
export class AuthService {

  constructor(
    private http: Http,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  registerUser(user): Observable<User> {
    return this.http.post(baseURL + '/users/register', user)
      .map(res => {return this.processHttpmsgService.extractData(res); })
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http.get(baseURL + '/users/checkUsername/' + username).map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(baseURL + '/users/checkEmail/' + email).map(res => res.json());
  }
}
