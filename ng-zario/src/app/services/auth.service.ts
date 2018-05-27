import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../shared/security';

import { Observable } from 'rxjs/Observable';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { baseURL } from '../shared/baseurl';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  // main user registration communication with the server
  registerUser(user): Observable<User> {
    return this.http.post(baseURL + '/users/register', user)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // send email to successarchitecture@gmail.com from user in contact support type environment
  contactSupport(contact) {
    return this.http.post(baseURL + '/contact/', contact);
  }

  // emails verification code to user email used in registration and lost password recovery  
  mailVerification(codeData) {
    return this.http.post(baseURL + '/users/mailer', codeData);
  }

  // Function to check if username is taken, used in registration
  checkUsername(username): Observable<any> {
    return this.http.get(baseURL + '/users/checkUsername/' + username);
  }

  // Function to check if e-mail is taken, used in registration
  checkEmail(email): Observable<any> {
    return this.http.get(baseURL + '/users/checkEmail/' + email);
  }
}
