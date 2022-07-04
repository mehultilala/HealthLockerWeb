import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../common/services/app.service';
import { AuthService } from '../common/services/auth.service';
import { LocalstorageService } from '../common/services/LocalstorageService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _appService: AppService,
    private _localStorage: LocalstorageService,
    private _authService: AuthService
  ) {}
  registerForm!: FormGroup;
  signUpStatusSub!: Subscription;
  statusText: string = '';

  ngOnInit() {
    this._authService.signUpProgress.next('');
    this._authService.signInProgress.next('');
    this.signUpStatusSub = this._authService.signUpProgress.subscribe(
      (val: any) => (this.statusText = val)
    );
    if (this._localStorage.getItem('signupUser')) {
      let user = JSON.parse(this._localStorage.getItem('signupUser') as string);
      this.preFilled(user);
    } else {
      this.setFields();
    }
  }

  ngOnDestroy() {
    this.signUpStatusSub.unsubscribe();
  }

  preFilled(user: any) {
    this.registerForm = this._fb.group({
      firstName: [
        user.firstName,
        [Validators.required, Validators.minLength(3)],
      ],
      lastName: [user.lastName, [Validators.required, Validators.minLength(3)]],
      phone: [
        user.phone,
        [Validators.required, Validators.pattern(/^\d{10,20}$/)],
      ],
      email: [
        user.email,
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  setFields() {
    this.registerForm = this._fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this._appService.args$.next([
        'Please enter valid registration details!',
        'error',
        '2000',
      ]);
      return;
    }
    this._localStorage.setItem(
      'signupUser',
      JSON.stringify(this.registerForm.value)
    );
    this._authService.register(this.registerForm.value).subscribe({
      next: (resp: any) => {
        this._localStorage.removeItem('signupUser');

        this._authService.storeToken(resp);
        // TODO
        // login form component this.afterSignIn();
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 1000);
        // TODO
        // this._router.navigate(['/auth', 'verify']);
      },
      error: (resp: HttpErrorResponse) => {
        if (resp.error.errors) {
          if (resp.error.errors.phone) {
            this.registerForm.controls['phone'].setErrors({
              taken: true,
            });
            this._authService.signUpProgress.next(
              'Sign up Failed. Please check your info.'
            );
          }
          if (resp.error.errors.email) {
            this.registerForm.controls['email'].setErrors({ taken: true });
            this._authService.signUpProgress.next(
              'Sign up Failed. Please check your info.'
            );
          }
        } else {
          this._authService.signUpProgress.next(
            'Sign up Failed. Please check your info.'
          );
        }
      },
    });
  }
}
