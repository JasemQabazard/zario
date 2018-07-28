import { Injectable } from '@angular/core';
import { Promotion, Comment } from '../shared/promotions';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service'; 

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class PromotionService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  getPromotions(mid: string): Observable<Promotion[]> {
    console.log("merchant _mid: ", mid);
    return  this.http.get(baseURL + '/promotions/bymid/'+ mid)
                    .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  // adding new promotion t0 database on the server
  addPromotion(promotion): Observable<Promotion> {
    return this.http.post(baseURL + '/promotions', promotion)
      .catch(error => {return this.processHttpmsgService.handleError(error)});
  }

  updatePromotion(pid: string, promotion: any) {
    return this.http.put(baseURL + '/promotions/' + pid , promotion)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  addComment(pid: string, remark: any) {
    return this.http.post(baseURL + '/promotions/' + pid + '/comments', remark)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  deleteComment(pid: string, cid: string) {
    return this.http.delete(baseURL + '/promotions/' + pid + '/comments/'+ cid)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

  updateComment(pid: string, cid: string, comment:any) {
    console.log("updateComment Service comment : ", comment);
    return this.http.put(baseURL + '/promotions/' + pid + '/comments/'+ cid, comment)
      .catch(error => { return this.processHttpmsgService.handleError(error); });
  }

}
