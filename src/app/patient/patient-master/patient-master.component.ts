import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Constants } from '../../common/constants';
import { AppService } from '../../common/services/app.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-patient-master',
  templateUrl: './patient-master.component.html',
  styleUrls: ['./patient-master.component.scss'],
})
export class PatientMasterComponent implements OnInit {
  constructor(
    private constants: Constants,
    private fb: FormBuilder,
    private _appService: AppService,
    private _http: HttpClient
  ) {}

  ngOnInit(): void {}

  crudOperation: string = 'ViewAll';

  genderList: string[] = this.constants.GENDER_LIST;
  maritalStatusList: string[] = this.constants.MARITAL_STATUS_LIST;
  religionList: string[] = this.constants.RELIGION_LIST;
  countryList: string[] = this.constants.COUNTRY_LIST;
  addressTypeList: string[] = this.constants.ADDRESS_TYPE_LIST;

  maxDOB: Date = new Date();

  progress: Number = 0;

  patientForm = this.fb.group({
    name: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    gender: [''],
    maritalStatus: [''],
    religion: [''],
    adharNo: ['', [Validators.minLength(12), Validators.maxLength(12)]],
    medicalInsured: [false, [Validators.required]],
    medicalInsurance: this.fb.group({
      company: [''],
      number: [''],
    }),
    fatherName: ['', [Validators.maxLength(200)]],
    motherName: ['', [Validators.maxLength(200)]],
    spouceName: ['', [Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{5,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
    addressObj: this.fb.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pin: ['', [Validators.required]],
      addressType: [''],
    }),
    emergencyContact: this.fb.group({
      fullName: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{5,20}$/)]],
    }),
  });

  crudOperationChange(action: string, data?: any) {
    if (action === 'ViewAll') {
      this.crudOperation = action;
    } else if (action === 'Create') {
      this.crudOperation = action;
      this.patientForm.patchValue({
        name: 'Mehul GovindBhai Tilala',
        dateOfBirth: '1993-10-10T18:30:00.000Z',
        gender: 'Male',
        maritalStatus: 'Married',
        religion: 'Hindu',
        adharNo: '123412341234',
        fatherName: 'Govindbhai',
        motherName: 'Sudhaben',
        spouceName: 'Jyoti',
        phone: '8758748221',
        email: 'mehultilala1993@gmail.com',
        addressObj: {
          address: 'pal',
          city: 'rajkot',
          state: 'gujarat',
          country: 'India',
          pin: '360004',
          addressType: 'Home',
        },
        emergencyContact: {
          fullName: 'pradip',
          relationship: 'brother',
          phone: '8758727258',
        },
      });
    } else if (action === 'SetCrudOperation') {
      this.crudOperation = data;
    }
  }

  submit(data: any) {
    if (this.patientForm.invalid) {
      this._appService.args$.next([
        'Please enter required details!',
        'warn',
        '2000',
      ]);
      return;
    }

    let postData: any = { ...data.value };

    if (postData.medicalInsured) {
      if (
        !postData.medicalInsurance.company ||
        !postData.medicalInsurance.number
      ) {
        this._appService.args$.next([
          'Please enter valid insurance details!',
          'warn',
          '2000',
        ]);
        return;
      }
      delete postData.medicalInsured;
    } else {
      delete postData.medicalInsured;
      delete postData.medicalInsurance;
    }

    this._http
      .post(`${environment.serverUrl}/api/patients/`, postData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response)
            this._appService.args$.next([
              'Patient created successfully!',
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
  closeDialog() {}

  downloadAllPatients() {
    this._http
      .post(`${environment.serverUrl}/api/patients/download`, null, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response) {
            this._appService.args$.next([
              'Patient downloaded successfully!',
              'success',
              '3000',
            ]);
            saveAs(event.body, 'Patients.xlsx');
          }
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
}
