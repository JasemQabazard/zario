import { Injectable } from '@angular/core';
import { Blog, Comment } from '../shared/blog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class BlogService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  getBlogs(): Observable<Blog[]> {
    return  this.http.get(baseURL + '/socials')
                    .catch(error => this.processHttpmsgService.handleError(error));
  }

  // adding new blog t0 socials database on the server
  addBlog(blog): Observable<Blog> {
    return this.http.post(baseURL + '/socials', blog)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateBlog(bid: string, blog: any) {
    return this.http.put(baseURL + '/socials/' + bid , blog)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  addComment(bid: string, remark: any) {
    return this.http.post(baseURL + '/socials/' + bid + '/comments', remark)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  deleteComment(bid: string, cid: string) {
    return this.http.delete(baseURL + '/socials/' + bid + '/comments/' + cid)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateComment(bid: string, cid: string, comment: any) {
    console.log('updateComment Service comment : ', comment);
    return this.http.put(baseURL + '/socials/' + bid + '/comments/' + cid, comment)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

}
