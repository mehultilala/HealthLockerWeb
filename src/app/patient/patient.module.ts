import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientMaterialModule } from './patient-material.module';
import { PatientMasterComponent } from './patient-master/patient-master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [PatientMasterComponent, PatientProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientRoutingModule,
    PatientMaterialModule,
    MatFileUploadModule,
    SweetAlert2Module.forRoot(),
  ],
})
export class PatientModule {}
