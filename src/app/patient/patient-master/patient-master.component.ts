import { HttpClient, HttpEventType } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Constants } from '../../common/constants';
import { AppService } from '../../common/services/app.service';
import { saveAs } from 'file-saver';
import { PatientService } from '../patient.service';
import { Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-master',
  templateUrl: './patient-master.component.html',
  styleUrls: ['./patient-master.component.scss'],
})
export class PatientMasterComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private _appService: AppService,
    private _http: HttpClient,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    this._patientService.getPatients({}).subscribe({
      next: (res: any) => {
        this._patientService.patients = res.data;
      },
      error: (err) => {
        console.log(err);
        this._patientService.patients = [];
        this._appService.args$.next([
          'Unable to fetch patients list.',
          'error',
          '2000',
        ]);
      },
    });

    this._patientService
      .patientsSub()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (res: any) => {
          this.patients = res;
        },
        error: (err) => {
          this.patients = [];
        },
      });
  }

  crudOperation: string = 'ViewAll';
  patients: any[] = [];
  patient: any = null;
  private unsubscribe: Subject<void> = new Subject();

  genderList: readonly string[] = Constants.GENDER_LIST;
  maritalStatusList: readonly string[] = Constants.MARITAL_STATUS_LIST;
  religionList: readonly string[] = Constants.RELIGION_LIST;
  countryList: readonly string[] = Constants.COUNTRY_LIST;
  addressTypeList: readonly string[] = Constants.ADDRESS_TYPE_LIST;
  creatorRelationshipList: readonly string[] =
    Constants.CREATORS_RELATIONSHIP_LIST;

  maxDOB: Date = new Date();

  progress: Number = 0;

  patientForm = this.fb.group({});

  resetPatientForm(patient?: any) {
    this.patientForm = this.fb.group({
      creatorsRelationship: ['', [Validators.required]],
      name: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: [''],
      maritalStatus: [''],
      religion: [''],
      adharNo: ['', [Validators.minLength(12), Validators.maxLength(12)]],
      medicalInsuranceFlag: [false, [Validators.required]],
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

    if (patient) {
      this.patientForm.patchValue(patient);
    }
  }

  @ViewChild('confirmBox')
  private confirmBox!: SwalComponent;
  cnfrmObj: any = {
    title: '',
    text: '',
    icon: 'warning',
    cnfrmButtonText: 'Submit',
  };

  swalMessageObj: any = {
    text: '',
    icon: '',
    showCloseButton: true,
    showCancelButton: true,
    cancelButtonText: 'Close',
    focusCancel: true,
    showConfirmButton: false,
    customClass: {
      closeButton: 'swal2-close-btn-custom',
      cancelButton: 'swal2-cancel-btn-white-custom',
    },
    timer: 5000,
  };

  crudOperationChange(action: string, data?: any) {
    if (action === 'ViewAll') {
      this.crudOperation = action;
      window.scrollTo(0, 0);
    } else if (action === 'Create') {
      this.resetPatientForm();
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
        medicalInsuranceFlag: false,
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
    } else if (action === 'View') {
      if (!data) return;
      this.crudOperation = action;
      this.patient = cloneDeep(data);
      window.scrollTo(0, 0);
    } else if (action === 'Edit') {
      if (!data) return;
      this.crudOperation = action;
      this.patient = cloneDeep(data);
      this.resetPatientForm(this.patient);
      window.scrollTo(0, 0);
    } else if (action === 'SetCrudOperation') {
      this.crudOperation = data;
      window.scrollTo(0, 0);
    }
  }

  savePatient(cnfrmFlag: boolean) {
    if (cnfrmFlag) {
      // validations
      if (this.patientForm.invalid) {
        this._appService.args$.next([
          'Please enter required details!',
          'warn',
          '2000',
        ]);
        return;
      }

      if (
        this.patientForm.value.medicalInsuranceFlag &&
        (!this.patientForm.value.medicalInsurance.company ||
          !this.patientForm.value.medicalInsurance.number)
      ) {
        this._appService.args$.next([
          'Please enter valid insurance details!',
          'warn',
          '2000',
        ]);
        return;
      }

      // open confirmation box
      this.cnfrmObj = {
        title: 'Create Patient',
        text: 'Are you sure, you want to create a patient?',
        icon: 'warning',
        cnfrmButtonText: 'Submit',
      };
      setTimeout(() => {
        this.confirmBox.fire().then((result) => {
          if (result.isConfirmed) {
            this.savePatient(false);
          }
        });
      });
    } else {
      let postData: any = { ...this.patientForm.value };

      if (!postData.medicalInsuranceFlag) {
        delete postData.medicalInsurance;
      }

      this._patientService.createPatient(postData).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response) {
            this.swalMessageObj.text = 'Patient created successfully!';
            this.swalMessageObj.icon = 'success';
            setTimeout(() => {
              Swal.fire(this.swalMessageObj);
            });
            this._patientService.addPatient(event.body.data);
            this.crudOperationChange('SetCrudOperation', 'ViewAll');
          }
        },
        error: (err: any) => {
          this.swalMessageObj.text =
            'Unable to create the patient, something went wrong!';
          this.swalMessageObj.icon = 'error';
          setTimeout(() => {
            Swal.fire(this.swalMessageObj);
          });
        },
      });
    }
  }

  updatePatient(cnfrmFlag: boolean) {
    if (cnfrmFlag) {
      // validations
      if (this.patientForm.invalid) {
        this._appService.args$.next([
          'Please enter required details!',
          'warn',
          '2000',
        ]);
        return;
      }

      if (
        this.patientForm.value.medicalInsuranceFlag &&
        (!this.patientForm.value.medicalInsurance.company ||
          !this.patientForm.value.medicalInsurance.number)
      ) {
        this._appService.args$.next([
          'Please enter valid insurance details!',
          'warn',
          '2000',
        ]);
        return;
      }

      // open confirmation box
      this.cnfrmObj = {
        title: 'Update Patient',
        text: 'Are you sure, you want to update a patient?',
        icon: 'warning',
        cnfrmButtonText: 'Update',
      };
      setTimeout(() => {
        this.confirmBox.fire().then((result) => {
          if (result.isConfirmed) {
            this.updatePatient(false);
          }
        });
      });
    } else {
      let postData: any = { ...this.patientForm.value };

      if (!postData.medicalInsuranceFlag) {
        delete postData.medicalInsurance;
      }

      this._patientService.updatePatient(postData, this.patient.id).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round((100 * event.loaded) / event.total);
          if (event.type === HttpEventType.Response) {
            this.swalMessageObj.text = 'Patient updated successfully!';
            this.swalMessageObj.icon = 'success';
            setTimeout(() => {
              Swal.fire(this.swalMessageObj);
            });
            this._patientService.modifyPatient(event.body.data);
            this.crudOperationChange('SetCrudOperation', 'ViewAll');
          }
        },
        error: (err: any) => {
          this.swalMessageObj.text =
            'Unable to update the patient, something went wrong!';
          this.swalMessageObj.icon = 'error';
          setTimeout(() => {
            Swal.fire(this.swalMessageObj);
          });
        },
      });
    }
  }

  downloadPatients() {
    let body = { filters: { status: 'InActive' } };
    this._http
      .post(`${environment.serverUrl}/api/patients/download`, body, {
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
