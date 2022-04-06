import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class BypassGuard implements CanActivate {

  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this._authService.loggedIn$.map(status => {
        if(status) {
          console.log("Navigating to Dashboard 2");
          this._router.navigate(['/dashboard']);
          return false;
        } else {
          return true;
        }
      });
  }
}
