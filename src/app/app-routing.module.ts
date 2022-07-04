import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { SigninComponent } from './signin/signin.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './common/auth.guard';
import { BypassGuard } from './common/bypass.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'our-services',
    component: OurServicesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about-us',
    component: AboutusComponent,
  },
  {
    path: 'contact-us',
    component: ContactusComponent,
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('./patient/patient.module').then((m) => m.PatientModule),
    canActivate: [AuthGuard],
  },
  { path: 'sign-in', component: SigninComponent, canActivate: [BypassGuard] },
  { path: 'sign-up', component: SignupComponent, canActivate: [BypassGuard] },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
