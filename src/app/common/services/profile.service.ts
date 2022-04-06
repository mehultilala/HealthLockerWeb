import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap } from 'rxjs';
import { LocalstorageService } from './LocalstorageService';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  currentUser$ = new BehaviorSubject<any>(null);

  constructor(private _localStorage: LocalstorageService) {}

  private fetchProfile() {}

  get currentUser(): any {
    return (
      this.currentUser$.value ||
      JSON.parse(this._localStorage.getItem('currentUser') as string)
    );
  }

  set currentUser(user: any) {
    this.currentUser$.next(user);
  }

  getProfile(): any {
    //TODO fetch user profile
    this.setCurrentUser(null);
  }

  setCurrentUser(userObj: any) {
    this.currentUser = userObj;
    this._localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  private updatePassword(input: any) {
    // TODO
    // input: {
    //   current_password: input.current_password,
    //   password: input.password,
    //   password_confirmation: input.password_confirmation,
    // }
  }

  private updateProfile(input: any) {}

  saveProfile(input: any): any {
    return this.updateProfile(input);
  }

  savePassword(input: any): any {
    return this.updatePassword(input);
  }
}
