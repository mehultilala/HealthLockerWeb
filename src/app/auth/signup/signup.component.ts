import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'truckola-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _auth: AuthService
  ) {}
  registerForm!: FormGroup;
  signUpStatusSub!: Subscription;
  statusText: String = '';

  ngOnInit() {
    this._auth.signUpProgress.next('');
    this._auth.signInProgress.next('');
    this.signUpStatusSub = this._auth.signUpProgress.subscribe(
      (val: any) => (this.statusText = val)
    );
    if (localStorage.getItem('signupUser')) {
      let user = JSON.parse(localStorage.getItem('signupUser') as string);
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
      name: [user.name, [Validators.required, Validators.minLength(4)]],
      // company_name: [user.company_name, [Validators.required, Validators.minLength(4)]],
      phone_number: [
        user.phone_number,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      // email: [user.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  setFields() {
    this.registerForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      // company_name: ['', [Validators.required, Validators.minLength(4)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let signupUser = localStorage.setItem(
        'signupUser',
        JSON.stringify(this.registerForm.value)
      );
      this._auth.register(this.registerForm.value).subscribe(
        (resp: any) => {
          if (resp.errors) {
            if (resp.errors.phone_number) {
              this.registerForm.controls['phone_number'].setErrors({
                taken: true,
              });
              this._auth.signUpProgress.next(
                'Sign up Failed. Please check your info.'
              );
            }
            if (resp.errors.email) {
              this.registerForm.controls['email'].setErrors({ taken: true });
              this._auth.signUpProgress.next(
                'Sign up Failed. Please check your info.'
              );
            }
          } else {
            this._auth.regFormData = this.registerForm.value;
            this._auth.regFormData.user_id = resp.user_id;
            this._router.navigate(['/auth', 'verify']);
          }
        },
        (err: HttpErrorResponse) => {
          this._auth.signUpProgress.next(
            'Sign up Failed. Please check your info.'
          );
        }
      );
    }
  }
}
