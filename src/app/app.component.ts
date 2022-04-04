import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  DoCheck,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { User } from './models/user';
import { BehaviorSubject, filter } from 'rxjs';
import { ProfileService } from './common/services/profile.service';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  static isBrowser = new BehaviorSubject<boolean | null>(null);

  currentUser: User | undefined;
  title: string | undefined;

  @ViewChild('toolbarContainer') toolbarRef: ElementRef | undefined;
  @ViewChild('footerContainer') footerRef: ElementRef | undefined;
  currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  userAgentType: String = 'DESKTOP';

  constructor(
    private _authService: AuthService,
    private _dialog: MatDialog,
    private _pService: ProfileService,
    private _router: Router,
    private _fb: FormBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngDoCheck() {}

  ngOnDestroy() {}

  signOut() {
    this._authService.signOut();
  }
}
