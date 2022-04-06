import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

// import { CustomerService } from './../services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  proportion: any = '100%';
  constructor(
    // public _customerService: CustomerService,
    private _router: Router
  ) // private window: Window
  {
    // if (this.window.outerHeight / this.window.outerWidth > 1.5)
    //   this.proportion = this.window.outerWidth * 0.75;
    // else
    this.proportion = '100%';

    // this.dummyCompanies = [
    //   {
    //     about:
    //       "World's No.1 lubricant company since last 13 years consecutively",
    //     banner: '/assets/img/company/shell_lubricants_banner.jpg',
    //     carousel: '/assets/img/company/shell_lubricants_carousel.jpg',
    //     createDateTime: '2020-05-02T08:34:28.873957',
    //     id: 2,
    //     logo: '/assets/img/company/shell_lubricants_logo.png',
    //     name: 'Shell Lubricants',
    //     status: 'ACTIVE',
    //     type: 'VENDOR',
    //     updateDateTime: '2020-07-20T22:08:28.508969',
    //     productTitle: '',
    //   },
    // ];
  }

  ngOnInit(): void {}

  viewProduct(id: number) {
    // this._router.navigate(['/products'], { queryParams: { company: id } });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
