import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'register', component: SignupComponent },
      { path: 'verify', component: VerificationComponent },
      { path: '', redirectTo: 'signin' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
