import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientMaterialModule } from './patient-material.module';
import { PatientMasterComponent } from './patient-master/patient-master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  declarations: [PatientMasterComponent, PatientProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientRoutingModule,
    PatientMaterialModule,
    MatFileUploadModule,
  ],
})
export class PatientModule {}
