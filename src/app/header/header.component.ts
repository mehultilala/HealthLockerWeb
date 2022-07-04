import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

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
  bannerPath = this.absPath + 'about_us_banner.jpg';
  defaultBanner = this.absPath + '/about_us_banner.jpg';

  sidebarRoutes: any[] = [
    {
      path: '/home',
      title: 'Health Locker',
      bannerPath: this.absPath + 'about_us_banner.jpg',
      metaTags: [
        { name: 'description', content: 'Home page of Health Locker' },
      ],
    },
    {
      path: '/our-services',
      title: 'Our Services',
      bannerPath: this.absPath + 'our_services_banner.jpg',
      metaTags: [
        { name: 'description', content: 'Services Provided by Health Locker' },
      ],
    },
    {
      path: '/about-us',
      title: 'About Us',
      bannerPath: this.absPath + 'about_us_banner.jpg',
      metaTags: [{ name: 'description', content: 'About | Health Locker' }],
    },
    {
      path: '/contact-us',
      title: 'Contact Us',
      bannerPath: this.absPath + 'contact_us_banner.jpg',
      metaTags: [
        { name: 'description', content: 'Contact details of Health Locker' },
      ],
    },
    {
      path: '/patient/master',
      title: 'Patient Master',
      bannerPath: this.absPath + 'contact_us_banner.jpg',
      metaTags: [
        { name: 'description', content: 'Patient Master | Health Locker' },
      ],
    },
    {
      path: '/patient/profile',
      title: 'Patient Profile',
      bannerPath: this.absPath + 'about_us_banner.jpg',
      metaTags: [
        { name: 'description', content: 'Patient Profile | Health Locker' },
      ],
    },
  ];

  user!: any;

  constructor(
    // public _customerService: CustomerService,
    private _appService: AppService,
    public _authService: AuthService,
    private _route: ActivatedRoute,
    private _windowTitle: Title,
    private _meta: Meta
  ) {
    this.isMobile = this._appService.isMobile;

    this.menuFlag = this.isMobile ? false : true;
  }

  ngOnInit(): void {
    this._appService.navigationEndReplay$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event: NavigationEnd) => {
        this.setPageTitleAndBanner(event.urlAfterRedirects.split('?')[0]);
        try {
          // gtag('config', 'UA-166803012-1', {
          //   'page_path' : event.urlAfterRedirects
          // });
        } catch (err) {
          console.log('google analytics error');
        }
      });

    this._authService.getUserObs
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user: any) => {
        console.log('user', user);
        this.user = user;
      });
  }

  toggleMenu() {
    if (this.isMobile) this.menuFlag = !this.menuFlag;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 5;
  }

  signOutSubmit() {
    this._authService.signOut();
  }
  /* Case 1if home/dashboard do not set title/banner
   *  Case: Product fetch company banner (set default if not present)
   *  Case: search for navigation item banners
   *  Else: if any path doesnt match do not set title/banner
   */
  setPageTitleAndBanner(url: any): void {
    try {
      let urlInput = url === '/' ? '/home' : url;
      const sidebarRoute = this.sidebarRoutes.find(
        (c: any) => c.path === urlInput
      );
      if (!!sidebarRoute) {
        this._windowTitle.setTitle(sidebarRoute.title);
        this.bannerPath = sidebarRoute.bannerPath;
        this.title = sidebarRoute.title;
        if (sidebarRoute.metaTags) {
          // sidebarRoute.metaTags.forEach((tag: any) => {
          //   if (this._meta.getTag('name=' + tag.name)) {
          //     this._meta.updateTag(tag);
          //   } else {
          //     this._meta.addTag(tag);
          //   }
          // });
          sidebarRoute.metaTags.forEach((tag: any) => {
            this._meta.updateTag(tag);
          });
        }
      } else {
        this.title = '';
        this._windowTitle.setTitle('Health Locker');
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
