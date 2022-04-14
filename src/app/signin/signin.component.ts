import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../common/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Subscription, Observable, interval, take, map } from 'rxjs';
import { ProfileService } from 'src/app/common/services/profile.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _dialogService: MatDialog,
    private _pService: ProfileService
  ) {
    this.success_msg = this.route.snapshot.queryParamMap.get('action');
    this.phone_no = this.route.snapshot.queryParamMap.get('phone_no');
  }

  profSub!: Subscription;
  loginForm!: FormGroup;
  signInStatusSub!: Subscription;
  statusText!: string;
  success_msg: any;
  phone_no: any;
  forgotPassForm!: FormGroup;
  newPassForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  resendDisabled = true;
  otpTimer!: Observable<number>;
  otpTimeout = 120;
  timeOutText = '';

  ngOnInit() {
    this.setFields();
    this.signInStatusSub = this._authService.signInProgress.subscribe(
      (val: any) => (this.statusText = val)
    );
    if (this.success_msg == 'success' || this.phone_no) {
      this.statusText =
        'You have been registered successfully. Please Login to Continue.';
    }
  }

  ngOnDestroy() {
    this.signInStatusSub.unsubscribe();
    if (this.profSub) {
      this.profSub.unsubscribe();
    }
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
    interval(1000)
      .pipe(
        take(this.otpTimeout),
        map((v: any) => this.otpTimeout - 1 - v)
      )
      .subscribe({
        next: (secs: any) => {
          this.timeOutText = this.timer(secs);
        },
        error: () => {},
        complete: () => {
          this.resendDisabled = !this.resendDisabled;
        },
      });
  }

  setFields() {
    this.loginForm = this._fb.group({
      userName: [
        this.phone_no,
        [
          Validators.required,
          Validators.pattern(
            /(^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$)|^\d{10}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    this._authService.authenticate(this.loginForm.value).subscribe({
      next: (resp: any) => {
        this._authService.storeToken(resp);
        this.afterSignIn();
      },
      error: (e: HttpErrorResponse) => this._authService.handleSignInError(e),
    });
  }

  openForgotPasswordForm(form: TemplateRef<any>) {
    this.closeDialog();
    this.forgotPassForm = this.buildPasswordForm();
    this.dialogRef = this._dialogService.open(form);
  }

  phone_number() {
    return this.forgotPassForm.value.phone_number;
  }

  openNewPasswordForm(form: any) {
    this.closeDialog();
    this.newPassForm = this.buildNewPasswordForm();
    this.dialogRef = this._dialogService.open(form);
  }

  buildNewPasswordForm() {
    return this._fb.group({
      user_id: [this._authService.regFormData.user_id, Validators.required],
      phone_number: [
        this._authService.regFormData.phone_number,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      action_id: [1, Validators.required],
    });
  }

  buildPasswordForm() {
    return this._fb.group({
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  mobile_no_submit(form: TemplateRef<any>) {
    if (this.forgotPassForm.valid) {
      this._authService.forgot_password(this.forgotPassForm.value).subscribe(
        (resp: any) => {
          if (resp.errors) {
            if (resp.errors.phone_number) {
              this.forgotPassForm.controls['phone_number'].setErrors({
                invalid: true,
              });
            }
          } else {
            this._authService.regFormData = this.forgotPassForm.value;
            this._authService.regFormData.user_id = resp.user_id;
            this.openNewPasswordForm(form);
            this.timeOutSetter();
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    }
  }

  savePassword() {
    if (this.newPassForm.valid) {
      this._authService.verify(this.newPassForm.value).subscribe(
        (resp: any) => {
          if (resp.otp_invalid) {
            this.newPassForm.controls['otp'].setErrors({ invalid: true });
          } else {
            this._router.navigate(['/auth', 'signin']);
            this.statusText = 'Password Updated successfully.';
            this.closeDialog();
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    }
  }

  resendOtp() {
    if (!this.resendDisabled) {
      this._authService
        .forgot_password(this._authService.regFormData)
        .subscribe(
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

  closeDialog() {
    if (this._dialogService.openDialogs.length > 0) this.dialogRef.close();
  }

  private afterSignIn(): void {
    this._router.navigate(['/']);
    // this.profSub = this._pService.getProfile().subscribe(() => {
    //   // console.log("Navigating to Dashboard");
    //   this._router.navigate(['/dashboard']);
    // });
  }
}
