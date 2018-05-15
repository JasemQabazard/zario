import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { baseURL } from '../shared/baseurl';

@Injectable()
export class AuthService {

  URL = baseURL;

  constructor(
    private http: Http
  ) { }

  registerUser(user) {
    return this.http.post(this.URL + '/users/register', user).map(res => res.json());
  }
}
