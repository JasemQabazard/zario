import { Injectable } from '@angular/core';
import { MProfile, Group, CProfile, Settings } from '../shared/profile';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service'; 

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProfileService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  getGroups(): Observable<Group[]> {
    return this.http.get(baseURL + '/groups')
    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  getGroup(username: string): Observable<Group> {
    console.log("group service username: ", username);
    return  this.http.get(baseURL + '/groups/byuser/'+ username)
                    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  getMProfiles(): Observable<MProfile[]> {
    return this.http.get(baseURL + '/merchants')
    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  getMProfile(username: string): Observable<MProfile[]> {
    console.log("profile service username: ", username);
    return  this.http.get(baseURL + '/merchants/byuser/'+ username)
                    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  getCProfile(username: string): Observable<CProfile> {
    console.log("profile service username: ", username);
    return  this.http.get(baseURL + '/customers/byuser/'+ username)
                    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // adding new group tp database on the server
  addGroup(group): Observable<Group> {
    return this.http.post(baseURL + '/groups', group)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  updateGroup(gid: string, group: any) {
    return this.http.put(baseURL + '/groups/' + gid , group)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
    
  }

  // adding new merchant to database on the server
  addMProfile(profile): Observable<MProfile> {
    return this.http.post(baseURL + '/merchants', profile)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  updateMProfile(pid: string, profile: any) {
    return this.http.put(baseURL + '/merchants/' + pid , profile)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // adding new merchant to database on the server
  addCProfile(profile): Observable<CProfile> {
    return this.http.post(baseURL + '/customers', profile)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  updateCProfile(pid: string, profile: any) {
    return this.http.put(baseURL + '/customers/' + pid , profile)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // adding new group tp database on the server
  imageUpload(form): Observable<any> {
    return this.http.post(baseURL + '/upload', form)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  // Settings get, post, and update routines
  getSettings(): Observable<Settings[]> {
    return this.http.get(baseURL + '/settings')
    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  addSettings(settings): Observable<Settings> {
    return this.http.post(baseURL + '/settings', settings)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  updateSettings(sid: string, settings: any) {
    return this.http.put(baseURL + '/settings/' + sid , settings)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }
}
