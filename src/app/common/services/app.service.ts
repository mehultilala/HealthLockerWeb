import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  args$ = new BehaviorSubject<string[]>([]); // msg,type,time
  pdfUrl$ = new BehaviorSubject<string>(''); // pdfUrl

  navigationEnd$ = this._router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd)
  );
  navigationEndReplay$ = this.navigationEnd$.pipe(shareReplay(1));

  userAgentType: string = 'DESKTOP';
  constructor(private _router: Router) {
    // if (
    //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    //     navigator.userAgent
    //   )
    // )
    //   this.userAgentType = 'MOBILE';
  }

  get isMobile(): boolean {
    return this.userAgentType === 'MOBILE';
  }
}
