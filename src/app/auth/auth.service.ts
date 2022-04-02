import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from '../common/services/profile.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pService: ProfileService
  ) {
    if (localStorage.getItem('auth_token') && !!localStorage.getItem('user')) {
      this.loggedIn$.next(true);
      this.authState = true;
    }
    this.loggedIn$.subscribe((val) => {
      this.authState = val; /*console.log( 'login change :' +val)*/
    });
  }

  authState: boolean = false;

  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    !!localStorage.getItem('auth_token')
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
    return `${environment.serverUrl}/client/auth_user`;
  }

  private get signUpAPI() {
    return `${environment.serverUrl}/client/sign_up`;
  }

  private get forgotPasswordAPI() {
    return `${environment.serverUrl}/client/forgot_password`;
  }

  private get verificationAPI() {
    return `${environment.serverUrl}/client/otp_verify`;
  }

  get authenticated(): boolean {
    return !!this.authState;
  }

  authenticate(credentials: any): Observable<any> {
    this.signInProgress.next('Siging in...');
    return this._httpClient.post<AuthResponse>(this.server(), credentials);
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

  storeToken(data: AuthResponse) {
    this.signInProgress.next('Signed in sucessfully. Please wait...');
    this.clearToken();
    localStorage.setItem('auth_token', data.auth_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.auth_token);
  }

  private clearToken() {
    if (localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
    }
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
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

interface AuthResponse {
  auth_token: string;
  user: {
    id: number;
    phone: string;
  };
}
