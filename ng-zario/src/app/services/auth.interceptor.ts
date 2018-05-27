import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loginService = this.inj.get(LoginService);
    // Get the auth header from the service.
    const authToken = loginService.getToken();
    // console.log("Interceptor: " + authToken);
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', 'bearer ' + authToken)});        
    
        // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}

// @Injectable()
// export class UnauthorizedInterceptor implements HttpInterceptor {
//   constructor(private inj: Injector) {}
 
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const loginService = this.inj.get(LoginService);
//     const authToken = loginService.getToken();
    
//     return next
//       .handle(req)
//       .do((event: HttpEvent<any>) => {
//           // do nothing            
//         }, (err: any) => {
//           if (err instanceof HttpErrorResponse) {
//             if (err.status === 401 && authToken) {
//               console.log("Unauthorized Interceptor: ", err);
//               loginService.checkJWTtoken();
//             }
//           }
//         });
//   }
// }