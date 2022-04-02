import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable, interval, take, map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'truckola-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}
  verificationForm!: FormGroup;
  resendDisabled = true;
  otpTimer!: Observable<number>;
  otpTimeout = 120;
  timeOutText = '';
  ngOnInit() {
    this.verificationForm = this._fb.group({
      user_id: [this._auth.regFormData.user_id, Validators.required],
      phone_number: [this._auth.regFormData.phone_number, Validators.required],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: [this._auth.regFormData.password, Validators.required],
    });
    this.timeOutSetter();
  }

  timer(seconds: number): string {
    if (seconds === 0) {
      return '0:00';
    }
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs}`;
  }

  timeOutSetter() {
    this.otpTimer = interval(1000).pipe(
      take(this.otpTimeout),
      map((v: any) => this.otpTimeout - 1 - v)
    );
    this.otpTimer.subscribe(
      (secs) => {
        this.timeOutText = this.timer(secs);
      },
      (e) => {},
      () => {
        this.resendDisabled = !this.resendDisabled;
      }
    );
  }

  phoneNumber() {
    return this._auth.regFormData.phone_number;
  }

  verify() {
    if (this.verificationForm.valid) {
      this._auth.verify(this.verificationForm.value).subscribe(
        (resp: any) => {
          if (resp.otp_invalid) {
            this.verificationForm.controls['otp'].setErrors({ invalid: true });
          } else {
            localStorage.removeItem('signupUser');
            this._router.navigate(['/auth', 'signin'], {
              queryParams: { action: 'success' },
            });
          }
        },
        (err: HttpErrorResponse) => {
          // let error = JSON.parse(err.error);
          // if(error.otp_invalid) {
          //   this.verificationForm.controls.otp.setErrors({invalid: true});
          // }
        }
      );
    }
  }

  resendOtp() {
    if (!this.resendDisabled) {
      this._auth.register(this._auth.regFormData).subscribe(
        (resp: any) => {
          this.resendDisabled = !this.resendDisabled;
          this.timeOutSetter();
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    }
  }
}
