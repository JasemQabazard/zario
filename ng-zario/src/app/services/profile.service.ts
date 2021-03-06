import { Injectable } from '@angular/core';
import { MProfile, Group, CProfile, Settings, CRM } from '../shared/profile';
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
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  getGroup(username: string): Observable<Group> {
    return  this.http.get(baseURL + '/groups/byuser/' + username)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  getMProfiles(): Observable<MProfile[]> {
    return this.http.get(baseURL + '/merchants')
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  getMProfile(username: string): Observable<MProfile[]> {
    return  this.http.get(baseURL + '/merchants/byuser/' + username)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }
  getGroupMerchants(gid: string): Observable<MProfile[]> {
    return  this.http.get(baseURL + '/merchants/bygroup/' + gid)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  getMProfileID(mid: string): Observable<MProfile> {
    return  this.http.get(baseURL + '/merchants/' + mid)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  getCProfileID(cid: string): Observable<CProfile> {
    return  this.http.get(baseURL + '/customers/' + cid)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // get cprofile by username
  getCProfile(username: string): Observable<CProfile> {
    return  this.http.get(baseURL + '/customers/byuser/' + username)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new group tp database on the server
  addGroup(group): Observable<Group> {
    return this.http.post(baseURL + '/groups', group)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateGroup(gid: string, group: any) {
    return this.http.put(baseURL + '/groups/' + gid , group)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  getGroupById(gid: string): Observable<Group> {
    return this.http.get(baseURL + '/groups/' + gid)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new merchant to database on the server
  addMProfile(profile): Observable<MProfile> {
    return this.http.post(baseURL + '/merchants', profile)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateMProfile(pid: string, profile: any) {
    return this.http.put(baseURL + '/merchants/' + pid , profile)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new merchant to database on the server
  addCProfile(profile): Observable<CProfile> {
    return this.http.post(baseURL + '/customers', profile)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateCProfile(pid: string, profile: any) {
    return this.http.put(baseURL + '/customers/' + pid , profile)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new CRM Record to database on the server
  addCRM(crm): Observable<CRM> {
    return this.http.post(baseURL + '/crms', crm)
      .catch(error => this.processHttpmsgService.handleError(error));
  }
  getCRM(cid: string): Observable<CRM[]> {
    console.log('crm service by cid: ', cid);
    return  this.http.get(baseURL + '/crms/bycid/' + cid)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }
  updateCRM(crmid: string, crm: any) {
    return this.http.put(baseURL + '/crms/' + crmid , crm)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new group tp database on the server
  imageUpload(form): Observable<any> {
    return this.http.post(baseURL + '/upload', form)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  // Settings get, post, and update routines
  getSettings(): Observable<Settings[]> {
    return this.http.get(baseURL + '/settings')
    .catch(error => this.processHttpmsgService.handleError(error));
  }

  addSettings(settings): Observable<Settings> {
    return this.http.post(baseURL + '/settings', settings)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateSettings(sid: string, settings: any) {
    return this.http.put(baseURL + '/settings/' + sid , settings)
      .catch(error => this.processHttpmsgService.handleError(error));
  }
}
