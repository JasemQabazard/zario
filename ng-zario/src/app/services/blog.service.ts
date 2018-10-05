import { Injectable } from '@angular/core';
import { Blog, Comment } from '../shared/blog';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class BlogService {

  constructor(
    private http: HttpClient,
    private httb: HttpClient,
    private httpBackend: HttpBackend,
    private processHttpmsgService: ProcessHttpmsgService
  ) {
    this.httb = new HttpClient(httpBackend);
  }

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
    console.log('2 bid, remark', bid, remark);
    return this.http.post(baseURL + '/socials/' + bid + '/comments', remark)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  deleteComment(bid: string, cid: string) {
    return this.http.delete(baseURL + '/socials/' + bid + '/comments/' + cid)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  updateComment(bid: string, cid: string, comment: any) {
    return this.http.put(baseURL + '/socials/' + bid + '/comments/' + cid, comment)
      .catch(error => this.processHttpmsgService.handleError(error));
  }

  postAWSMediaURL(specs): Observable<any> {
    return  this.http.get(baseURL + '/upload/aws/' + specs)
                    .catch(error => this.processHttpmsgService.handleError(error));
  }
  putAWSMedia(url , file) {
    console.log('blog service putting aws media' , url, file);
    return this.httb.put(url, file, {headers:
      {'Content-Type': file.type}})
      .catch(error => this.processHttpmsgService.handleError(error));
  }
}
