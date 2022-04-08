import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
// import { ProfileService } from '../core/api/profile.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _router: Router,
    private _authService: AuthService // private _pService: ProfileService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.authenticated) {
      return true;
    }
    this._router.navigate(['/home']);
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.authenticated) {
      return true;
    }
    this._router.navigate(['/home']);
    return false;
  }

  allowIf(state: any): boolean {
    //skip agreement if signed or data required for signing agrmt are not available
    // let user = this._pService.currentUser;
    // let agrmt_not_needed: boolean =
    //   user.agrmt_signed ||
    //   !user.company_name ||
    //   !user.email ||
    //   !user.address1 ||
    //   !user.designation;
    // return (
    //   agrmt_not_needed ||
    //   state.url == '/dashboard/agreement' ||
    //   state.url == '/dashboard/profile'
    // );
    return true;
  }
}
