import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retry, catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { LoadingSpinnerService } from './loading-spinner.service';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _loadingSpinnerService: LoadingSpinnerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone();

    req = this.addAuthenticationToken(req);

    if (req.method === 'POST') this._loadingSpinnerService.reveal();

    return next.handle(req).pipe(
      retry(1),
      catchError((error, caught) => {
        // remove token on unauthorized error
        if (error.status === 401) this._authService.signOut();
        return of(error);
      }) as any,
      finalize(() => this._loadingSpinnerService.hide())
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (!!this._authService.getToken())
      return request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this._authService.getToken()
        ),
      });
    return request;
  }
}
