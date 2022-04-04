import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../common/services/profile.service';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from '../LocalstorageService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pService: ProfileService,
    private _localStorage: LocalstorageService
  ) {
    if (
      this._localStorage.getItem('authToken') &&
      !!this._localStorage.getItem('user')
    ) {
      this.loggedIn$.next(true);
      this.authState = true;
    }
    this.loggedIn$.subscribe((val) => {
      this.authState = val; /*console.log( 'login change :' +val)*/
    });
  }

  authState: boolean = false;

  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    !!this._localStorage.getItem('authToken')
  );
  signInProgress: BehaviorSubject<string> = new BehaviorSubject('');
  signUpProgress: BehaviorSubject<string> = new BehaviorSubject('');

  private registrationData: Object = {};

  set regFormData(data: any) {
    this.registrationData = data;
  }

  get regFormData(): any {
    return this.registrationData;
  }

  private server() {
    return `${environment.serverUrl}/api/auth/sign-in`;
  }

  private get signUpAPI() {
    return `${environment.serverUrl}/api/auth/sign-up`;
  }

  private get forgotPasswordAPI() {
    return `${environment.serverUrl}/api/auth/forgot-password`;
  }

  private get verificationAPI() {
    return `${environment.serverUrl}/client/otp_verify`;
  }

  get authenticated(): boolean {
    return !!this.authState;
  }

  authenticate(credentials: any): Observable<any> {
    this.signInProgress.next('Siging in...');
    return this._httpClient.post<any>(this.server(), credentials);
  }

  register(signupParams: any): Observable<any> {
    this.signUpProgress.next('Signing up. Please wait...');
    return this._httpClient.post<any>(this.signUpAPI, signupParams);
  }

  forgot_password(params: any): Observable<any> {
    return this._httpClient.post<any>(this.forgotPasswordAPI, params);
  }

  verify(verificationParams: any): Observable<any> {
    return this._httpClient.post<any>(this.verificationAPI, verificationParams);
  }

  afterSignUp(resp: any) {
    console.log(resp);
  }

  handleSignUpError(e: HttpErrorResponse) {
    console.log(e);
  }

  handleSignInError(e: HttpErrorResponse) {
    if (e.status == 401) {
      this.signInProgress.next(
        'Unable to sign in. Please enter valid Email/Password.'
      );
    } else {
      this.signInProgress.next('Network error.');
    }
  }

  storeToken(data: any) {
    this.signInProgress.next('Signed in sucessfully. Please wait...');
    this.clearToken();
    this._localStorage.setItem('authToken', data.authToken);
    this._localStorage.setItem('user', JSON.stringify(data.user));
  }

  getToken() {
    return this._localStorage.getItem('authToken');
  }

  private clearToken() {
    if (this._localStorage.getItem('authToken')) {
      this._localStorage.removeItem('authToken');
    }
    this._localStorage.removeItem('user');
    this._localStorage.removeItem('authToken');
  }

  signOut() {
    this.clearToken();
    this.afterSignOut();
  }

  // this.signInProgress.next('');

  private afterSignOut(): void {
    this.signInProgress.next('Signed Out sucessfully.');
    this.loggedIn$.next(false);
    this._router.navigate(['/auth']);
  }
}
