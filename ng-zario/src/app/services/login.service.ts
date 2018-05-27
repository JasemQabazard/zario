import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

interface AuthResponse {
  status: string,
  success: string,
  token: string,
  role: string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable()
export class LoginService {

  tokenKey: string = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  userrole: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + '/users/checkJWTtoken')
    .subscribe(res => {
      console.log("JWT Token Valid: ", res);
      this.sendUsername(res.user.username);
      this.sendUserrole(res.user.role);
    },
    err => {
      console.log("JWT Token invalid: ", err);
      this.destroyUserCredentials();
    })
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  sendUserrole(role: string) {
    this.userrole.next(role);
  }

  clearUserrole() {
    this.userrole.next(undefined);
  }

  loadUserCredentials() {
    var credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    console.log("loadUserCredentials ", credentials);
    if (credentials && credentials.username != undefined) {
      this.useCredentials(credentials);
      if (this.authToken)
        this.checkJWTtoken();
    }
  }

  storeUserCredentials(credentials: any) {
    console.log("storeUserCredentials ", credentials);    
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
    this.sendUserrole(credentials.userrole);
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.clearUserrole();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + '/users/login',
    {"username": user.username, "password": user.password})
      .map(res => {
          this.storeUserCredentials({username: user.username, token: res.token, userrole: res.role});
          return {'success': true, 'username': user.username };
      })
        .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  logOut() {
    this.destroyUserCredentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }
  getUserrole(): Observable<string> {
    return this.userrole.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }
}
