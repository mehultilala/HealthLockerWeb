import {
  Component,
  AfterViewInit,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { trigger, transition, style, animate } from '@angular/animations';

import { AppService } from './common/services/app.service';
import { isPlatformBrowser } from '@angular/common';
// import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('goToTopAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  static isBrowser = new BehaviorSubject<boolean | null>(null);
  private unsubscribe: Subject<void> = new Subject();
  pdfURL!: string;
  isHidden = true;
  showHeaderFooter = true;

  constructor(
    public _appService: AppService,
    // public _customerService: CustomerService,
    private _snackBar: MatSnackBar,
    // private window: Window,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this._appService.args$
      .pipe(
        filter((arr: any[]) => arr.length === 3),
        takeUntil(this.unsubscribe)
      )
      .subscribe((arr: any[]) => {
        this._snackBar.open(arr[0], 'close', {
          duration: Number(arr[2]),
          panelClass: ['snack-' + arr[1]],
          verticalPosition: 'top',
        });
      });

    this._appService.navigationEndReplay$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event: NavigationEnd) => {
        this.showHeaderFooter = event.urlAfterRedirects !== '/sign-in';
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // if ((this.window.scrollY || 0) > 100) this.isHidden = false;
    // else this.isHidden = true;
  }

  topFunction() {
    // window.scroll(0, 0);
  }

  ngAfterViewInit() {
    this._appService.pdfUrl$
      .pipe(
        filter((url: any) => url.length > 5),
        takeUntil(this.unsubscribe)
      )
      .subscribe((url: any) => {
        this.pdfURL = url;
        this.openPdf();
      });
  }

  openPdf() {
    window.open(this.pdfURL, '_blank');
  }

  navigateToService() {
    // this._customerService.openServiceFormFlag$.next(true);
    // this._router.navigate(['/our-services']);
  }

  navigateToContact() {
    this._router.navigate(['/contact-us']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
