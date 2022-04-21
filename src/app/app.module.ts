import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './custom-material.module';
import { LoadingSpinnerComponent } from './common/components/loading-spinner.component';
import { UrlInterceptor } from './common/url.interceptor';

import { HeaderComponent } from './header/header.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { OurServicesComponent } from './our-services/our-services.component';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

import { BypassGuard } from './common/bypass.guard';
import { AuthGuard } from './common/auth.guard';
import { ReviewComponent } from './review/review.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutusComponent,
    ContactusComponent,
    OurServicesComponent,
    LoadingSpinnerComponent,
    SigninComponent,
    SignupComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [
    BypassGuard,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
