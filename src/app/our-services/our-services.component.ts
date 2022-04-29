import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AppService } from '../common/services/app.service';
// import { CustomerService } from './../services/customer.service';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
})
export class OurServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  sf!: FormGroup;
  progress = 0;
  dialogRef!: MatDialogRef<any>;
  @ViewChild('sfTmpl', { static: false }) sfRef!: TemplateRef<any>;

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    public _appService: AppService // public _customerService: CustomerService
  ) {}

  services: any[] = [
    {
      id: 1,
      createDateTime: new Date(),
      name: 'First Service',
      description:
        'This service is for the perople finfss sdfsd sdf sdf sdf sdf sdf sdf sdfnmnafnajsd asdfas asdfasdfasdff asdfd asdffas asddfasddfa sdf asdffasdfdasdfasdf asfd asdf asaddf asddf aasddf',
      siteLink: 'https://google.com',
      status: 'Active',
      img: 'http://localhost:4200/assets/img/service.jpg',
    },
    {
      id: 2,
      createDateTime: new Date(),
      name: 'First Service',
      description:
        'This service is for the perople finfss sdfsd sdf sdf sdf sdf sdf sdf sdfnmnafnajsd asdfas asdfasdfasdff asdfd asdffas asddfasddfa sdf asdffasdfdasdfasdf asfd asdf asaddf asddf aasddf',
      siteLink: 'https://google.com',
      status: 'Active',
      img: 'http://localhost:4200/assets/img/service.jpg',
    },
    {
      id: 3,
      createDateTime: new Date(),
      name: 'First Service',
      description:
        'This service is for the perople finfss sdfsd sdf sdf sdf sdf sdf sdf sdfnmnafnajsd asdfas asdfasdfasdff asdfd asdffas asddfasddfa sdf asdffasdfdasdfasdf asfd asdf asaddf asddf aasddf',
      siteLink: 'https://google.com',
      status: 'Active',
      img: 'http://localhost:4200/assets/img/service.jpg',
    },
  ];
  ngOnInit(): void {
    // this._customerService.fetchServices();
    this.buildServiceForm();
  }

  public scrollToAnchor(location: string, wait = 1000): void {
    setTimeout(() => {
      const element = document.querySelector('#service' + location);
      if (element)
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
    }, wait);
  }

  buildServiceForm(id?: number) {
    this.sf = this._formBuilder.group({
      type: ['SERVICE', [Validators.required]],
      serviceId: [id ? id : null, [Validators.required]],
      name: [null, [Validators.required, Validators.minLength(5)]],
      companyName: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      message: [null, [Validators.required, Validators.minLength(10)]],
    });
  }

  openServiceRequestForm(formTmpl: TemplateRef<any>, id?: number) {
    if (id) this.sf.patchValue({ serviceId: id });
    this.dialogRef = this._matDialog.open(formTmpl);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openServiceSite(url: any) {
    // window.open(url, '_blank');
  }

  submit(form: any) {
    if (this.sf.invalid) {
      this._appService.args$.next([
        'Please enter required Details!',
        'warn',
        '2000',
      ]);
      return false;
    }
    this._http
      .post('/enquiries/', this.sf.value, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response) {
            this.closeDialog();
            this._appService.args$.next([
              'Service Request raised Successfully!',
              'success',
              '3000',
            ]);
          }
        },
        error: (err) => {
          this._appService.args$.next([
            'Something Went Wrong!',
            'error',
            '2000',
          ]);
        },
      });
    return true;
  }

  ngAfterViewInit() {
    // this._customerService.openServiceFormFlag$
    //   .pipe(
    //     filter((flag: boolean) => flag),
    //     takeUntil(this.unsubscribe)
    //   )
    //   .subscribe((flag) => {
    //     this.openServiceRequestForm(this.sfRef);
    //     this._customerService.openServiceFormFlag$.next(false);
    //   });
    // if (this.route.snapshot.fragment)
    // this.scrollToAnchor(this.route.snapshot.fragment);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
