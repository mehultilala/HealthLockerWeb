import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { MaterialModule } from '../custom-material.module';
import { PatientMasterComponent } from './patient-master/patient-master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientProfileComponent } from '../patient-profile/patient-profile.component';

@NgModule({
  declarations: [PatientMasterComponent, PatientProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientRoutingModule,
    MaterialModule,
  ],
})
export class PatientModule {}
