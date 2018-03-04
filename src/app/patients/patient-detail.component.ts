import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { PatientService } from './patient.service';
import { PatientEntry } from './patient-entry';

@Component({
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {

  pageTitle : string ='Patient Detail';
  patient : PatientEntry;
  errorMessage : string;

  constructor(private _route: ActivatedRoute,
              private _router:Router,
              private _patientService: PatientService) { 

  }

  ngOnInit() {
    const param = this._route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getPatient(id);
    }
  }

  getPatient(id: number) {
    this._patientService.getPatient(id).subscribe(
      patient => this.patient = patient,
      error => this.errorMessage = <any>error);
  }

  onBack(): void{
    this._router.navigate(['/patients']);
  }

}
