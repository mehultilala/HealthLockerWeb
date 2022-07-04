import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// import { CustomerService } from './../services/customer.service';
// import { FeaturedSolution } from './../models/featured-solution';
// import { Company } from './../models/company';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent implements OnInit, OnDestroy {
  @Input() showHomeContent: boolean = false;
  private unsubscribe: Subject<void> = new Subject();
  features: any[] = [];
  // companies: Company[] = [];

  constructor(
    // public _customerService: CustomerService,
    private _router: Router
  ) {
    // try{
    //   this._customerService.fetchFeaturedSolutions();
    // } catch (error) {
    //   console.warn(error.message);
    // }
  }

  ngOnInit(): void {
    // this._customerService.featuredSolutionsSub()
    //     .pipe(filter(x => !!x), takeUntil(this.unsubscribe))
    //     .subscribe((list)=>{
    //       this.features = list;
    //     });
    // this._customerService.companiesSub()
    //     .pipe(filter(x => !!x), takeUntil(this.unsubscribe))
    //     .subscribe((list)=>{
    //       this.companies = list;
    //     });
  }

  viewSolution(feature: any) {
    if (feature.type === 'CATEGORY') {
      if (!!feature.subId)
        this._router.navigate(['/products'], {
          queryParams: {
            company: '' + feature.companyId,
            category: '' + feature.subId,
          },
          fragment: '' + feature.subId,
        });
      else
        this._router.navigate(['/products'], {
          queryParams: { company: '' + feature.companyId },
        });
    } else if (feature.type === 'SERVICE') {
      this._router.navigate(['/our-services'], {
        fragment: '' + feature.serviceId,
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
