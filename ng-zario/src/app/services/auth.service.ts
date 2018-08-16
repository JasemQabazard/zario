import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { User } from '../shared/security';

import { Observable } from 'rxjs/Observable';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { baseURL } from '../shared/baseurl';

interface AuthResponse {
  status: string,
  success: string,
  token: string,
  role: string,
  realname:string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable()
export class AuthService {

  tokenKey: string = 'JWT'; 
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  userrole: Subject<string> = new Subject<string>();
  realname: Subject<string> = new Subject<string>();

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
    return this.http.post(baseURL + '/contact/', contact)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // emails verification code to user email used in registration and lost password recovery  
  mailVerification(codeData) {
    return this.http.post(baseURL + '/users/mailer', codeData)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // MADD mailer to user email with registration data   
  maddmailer(mailerBody) {
    return this.http.post(baseURL + '/users/maddmailer', mailerBody)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Function to check if username is taken, used in registration
  checkUsername(username): Observable<any> {
    return this.http.get(baseURL + '/users/checkUsername/' + username)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Functions to get/ update user using username, used in useramend.component.ts user date Update
  // and group
  getUser(username): Observable<any> {
    return this.http.get(baseURL + '/users/userUpdate/' + username)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }
  updateUser(uid: string, user: any) {
    return this.http.put(baseURL + '/users/' + uid , user)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // Function to check if e-mail is taken, used in registration
  checkEmail(email): Observable<any> {
    return this.http.get(baseURL + '/users/checkEmail/' + email)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }
 
  // emails verification code to user email used in forget/lost password recovery  
  forgetPasswordVerification(codeData) {
    return this.http.post(baseURL + '/users/passwordcodemailer', codeData)
    .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Function to RESET THE PASSWORD  FOR THE USER
  passwordReset(user): Observable<any> {
    return this.http.post(baseURL + '/users/passwordreset', user)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + '/users/checkJWTtoken')
    .subscribe(res => {
      console.log("JWT Token Valid: ", res);
      this.sendUsername(res.user.username);
      this.sendUserrole(res.user.role);
      this.sendRealname(res.user.firstname+" "+res.user.lastname);
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

  sendRealname(Rname: string) {
    this.realname.next(Rname);
  }

  clearRealname() {
    this.realname.next(undefined);
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
    this.sendRealname(credentials.realname);
    this.authToken = credentials.token;
    this.sendUserrole(credentials.userrole);
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.clearRealname();
    this.clearUserrole();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + '/users/login',
    {"username": user.username, "password": user.password})
      .map(res => {
          this.storeUserCredentials({username: user.username, token: res.token, userrole: res.role, realname:res.realname});
          return {'success': true, 'username': user.username };
      })
        .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // Function to CHANGE THE PASSWORD  FOR THE USER
  passwordChange(user): Observable<any> {
    return this.http.post(baseURL + '/users/passwordchange', user)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Function to check if old password supplied in the change password form is equal to the existing password 
  checkOldPassword(user: any): Observable<any> {
    return this.http.post(baseURL + '/users/checkOldPassword', 
    {"username": user.username, "password": user.password})
    .catch(error => {return this.processHttpmsgService.handleError(error)});
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
  getRealname(): Observable<string> {
    return this.realname.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }

}
