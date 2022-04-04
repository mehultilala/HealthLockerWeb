import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../custom-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AuthRoutingModule,
  ],
  declarations: [
    SigninComponent,
    ForgotPasswordComponent,
    AuthComponent,
    SignupComponent,
    VerificationComponent,
  ],
})
export class AuthModule {}
