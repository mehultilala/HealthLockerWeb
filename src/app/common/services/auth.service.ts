import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './LocalstorageService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _localStorage: LocalstorageService
  ) {
    if (
      this._localStorage.getItem('authToken') &&
      !!this._localStorage.getItem('user')
    ) {
      this.loggedIn$.next(true);
      let user = this._localStorage.getItem('user') || '';
      this.user$.next(JSON.parse(user));
    }
  }

  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    !!this._localStorage.getItem('authToken')
  );
  get getLoggedInObs(): any {
    return this.user$.asObservable();
  }

  private user$: BehaviorSubject<any> = new BehaviorSubject(null);
  get getUserObs(): any {
    return this.user$.asObservable();
  }

  signInProgress: BehaviorSubject<string> = new BehaviorSubject('');
  signUpProgress: BehaviorSubject<string> = new BehaviorSubject('');

  private registrationData: Object = {};

  set regFormData(data: any) {
    this.registrationData = data;
  }

  get regFormData(): any {
    return this.registrationData;
  }

  private signInAPI() {
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
    return !!this.loggedIn$.value;
  }

  get user(): any {
    return this.user$.value;
  }

  authenticate(credentials: any): Observable<any> {
    this.signInProgress.next('Siging in...');
    return this._httpClient.post<any>(this.signInAPI(), credentials);
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
    if (e.status == 400) {
      this.signInProgress.next(
        'Unable to sign in. Please enter valid user name and password.'
      );
    } else {
      this.signInProgress.next('Network error.');
    }
  }

  storeToken(data: any) {
    this.signInProgress.next('Signed in sucessfully. Please wait...');
    this.signUpProgress.next('Signed up sucessfully.');
    this.clearToken();
    this._localStorage.setItem('authToken', data.authToken);
    this._localStorage.setItem('user', JSON.stringify(data.user));
    this.loggedIn$.next(true);
    this.user$.next(data.user);
  }

  getToken() {
    return this._localStorage.getItem('authToken');
  }

  signOut() {
    this.clearToken();
    this.afterSignOut();
  }

  private clearToken() {
    this._localStorage.removeItem('user');
    this._localStorage.removeItem('authToken');
  }

  private afterSignOut(): void {
    this.signInProgress.next('Signed Out sucessfully.');
    this.loggedIn$.next(false);
    this.user$.next(null);
    this._router.navigate(['/home']);
  }
}
