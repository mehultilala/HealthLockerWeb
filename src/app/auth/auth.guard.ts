import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { ProfileService } from '../core/api/profile.service';

@Injectable()
export class AuthGuard implements CanActivateChild {

  constructor(private _router: Router, private _authService: AuthService, private _pService: ProfileService) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this._authService.authenticated) {
        if(this.allowIf(state)) {
          return true;
        } else {
          this._router.navigate(['/dashboard','agreement'])
          return false;
        }
      }
      this._router.navigate(['/auth'])
      return false;
  }

  allowIf(state:any):boolean {
    //skip agreement if signed or data required for signing agrmt are not available
    let user = this._pService.currentUser;
    let agrmt_not_needed: boolean = user.agrmt_signed || !user.company_name || !user.email || !user.address1 || !user.designation
    return agrmt_not_needed || state.url=='/dashboard/agreement' || state.url=='/dashboard/profile'
  }
}
