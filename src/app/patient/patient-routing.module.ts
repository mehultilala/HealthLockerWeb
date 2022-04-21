import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientProfileComponent } from '../patient-profile/patient-profile.component';
import { PatientMasterComponent } from './patient-master/patient-master.component';

const routes: Routes = [
  {
    path: 'master',
    component: PatientMasterComponent,
  },
  {
    path: 'profile',
    component: PatientProfileComponent,
  },
  { path: '**', redirectTo: 'master' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
