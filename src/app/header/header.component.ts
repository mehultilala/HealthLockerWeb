import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

// import { CustomerService } from './../services/customer.service';
import { AppService } from '../common/services/app.service';
import { AuthService } from '../common/services/auth.service';

// declare var gtag;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  isSticky: boolean = false;
  isMobile: boolean = false;
  menuFlag: boolean = true;

  title: string = '';
  path: string = '';
  absPath = '/assets/img/';
  bannerPath = this.absPath + 'n_b_mercantile_about.jpg';
  defaultBanner = this.absPath + '/our_services_banner.jpg';

  sidebarRoutes: any[] = [
    {
      path: '/home',
      title: 'NB Mercantile',
      bannerPath: '',
    },
    {
      path: '/our-services',
      title: 'Our Services',
      bannerPath: this.absPath + 'our_services_banner.jpg',
    },
    {
      path: '/about-us',
      title: 'About Us',
      bannerPath: this.absPath + 'about_us_banner.jpg',
    },
    {
      path: '/contact-us',
      title: 'Contact Us',
      bannerPath: this.absPath + 'contact_us_banner.jpg',
    },
  ];

  constructor(
    // public _customerService: CustomerService,
    private _appService: AppService,
    public _authService: AuthService,
    private _route: ActivatedRoute,
    private _windowTitle: Title
  ) {
    this._appService.navigationEndReplay$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event: NavigationEnd) => {
        this.setPageTitleAndBanner(event.url.split('?')[0]);
        try {
          // gtag('config', 'UA-166803012-1', {
          //   'page_path' : event.urlAfterRedirects
          // });
        } catch (err) {
          console.log('google analytics error');
        }
      });

    this.isMobile = this._appService.isMobile;

    this.menuFlag = this.isMobile ? false : true;
  }

  ngOnInit(): void {}

  toggleMenu() {
    if (this.isMobile) this.menuFlag = !this.menuFlag;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 5;
  }

  /* Case 1if home/dashboard do not set title/banner
   *  Case: Product fetch company banner (set default if not present)
   *  Case: search for navigation item banners
   *  Else: if any path doesnt match do not set title/banner
   */
  setPageTitleAndBanner(url: any): void {
    try {
      if (url === '/home') {
        this._windowTitle.setTitle(this.sidebarRoutes[0].title);
        this.title = '';
      } else if (url.startsWith('/dashboard')) {
        this.title = 'Dashboard Front';
        this._windowTitle.setTitle('Dashboard');
        this.bannerPath = this.defaultBanner;
      } else {
        const child = this.sidebarRoutes.find((c: any) =>
          url.startsWith(c.path)
        );
        if (!!child) {
          this._windowTitle.setTitle(child.title);
          this.bannerPath = child.bannerPath;
          this.title = child.title;
        } else {
          this.title = '';
          this._windowTitle.setTitle('NB Mercantile');
        }
      }
    } catch (error: any) {
      console.warn(error.message);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
