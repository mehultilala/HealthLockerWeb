import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-master',
  templateUrl: './patient-master.component.html',
  styleUrls: ['./patient-master.component.scss'],
})
export class PatientMasterComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  crudOperation: string = 'ViewAll';

  genderList: String[] = ['Male', 'Female', 'Other'];

  progress: Number = 0;

  patientForm = this.fb.group({
    name: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    gender: [''],
    maritalStatus: [''],
    religion: [''],
    adharNo: ['', [Validators.minLength(12), Validators.maxLength(12)]],
    medicalInsured: [[false, Validators.required]],
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
    } else if (action === 'SetCrudOperation') {
      this.crudOperation = data;
    }
  }

  submit(form: any) {
    console.log(this.patientForm.value);
    if (this.patientForm.invalid) {
      //this._appService.args$.next(['Please enter required Details!', 'warn', '2000']);
      return;
    }
  }

  closeDialog() {}
}
