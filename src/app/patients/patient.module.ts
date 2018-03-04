import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PatientListComponent } from './patient-list.component';
import { PatientDetailComponent } from './patient-detail.component';

import { PatientGuardService } from './patient-guard.service';
import { PatientService } from './patient.service';
import { SharedModule } from './../shared/shared.module';
import { PatientComponent } from './patient.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'patients', component:PatientListComponent},
      {path:'patients/:id', canActivate:[PatientGuardService], component:PatientDetailComponent},
      {path:'patient/:id', component:PatientComponent}
    ]),
    SharedModule
  ],
  declarations: 
  [
    PatientListComponent,
    PatientDetailComponent,
    PatientComponent
  ],
  providers:[
    PatientService,
    PatientGuardService
  ]
})
export class PatientModule { }
