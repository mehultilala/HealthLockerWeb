import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError, timer } from 'rxjs';
import { retry, catchError, finalize } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { LoadingSpinnerService } from './services/loading-spinner.service';
import { environment } from 'src/environments/environment';

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

    if (
      req.method === 'POST' ||
      req.method === 'PUT' ||
      req.method === 'DELETE'
    )
      this._loadingSpinnerService.reveal();

    return next.handle(req).pipe(
      retry({
        count: 1,
        delay: this.retryNotifier,
      }),
      catchError((error, caught) => {
        // remove token on unauthorized error
        if (error.status === 401) {
          this._authService.signOut();
          return EMPTY;
        }
        //return of(error);
        return throwError(() => error);
      }) as any,
      finalize(() => this._loadingSpinnerService.hide())
    );
  }

  retryNotifier(error: any, retryCount: number) {
    // console.log(error, retryCount);

    if (error.status === 504) {
      return timer(1000);
    }

    throw error;
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    const isApiUrl = request.url.startsWith(environment.serverUrl);
    if (!!this._authService.getToken() && isApiUrl)
      return request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this._authService.getToken()
        ),
      });
    return request;
  }
}
