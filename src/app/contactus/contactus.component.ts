import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppService } from '../common/services/app.service';
// import { CustomerService } from './../services/customer.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})
export class ContactusComponent implements OnInit, OnDestroy {
  ef!: FormGroup;
  progress: number = 0;

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    public _appService: AppService // public _customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.buildEnquiryForm();
  }

  buildEnquiryForm() {
    this.ef = this._formBuilder.group({
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

  submitEnquiry(data: any) {
    if (this.ef.invalid) {
      this._appService.args$.next([
        'Please enter required Details!',
        'warn',
        '2000',
      ]);
      return false;
    }
    this._http
      .post('/enquiries', data.value, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response)
            this._appService.args$.next([
              'Enquiry submitted successfully!',
              'success',
              '3000',
            ]);
        },
        error: (err: any) => {
          this._appService.args$.next([
            'Something went wrong!',
            'error',
            '2000',
          ]);
        },
      });
    return true;
  }

  ngOnDestroy() {}
}
