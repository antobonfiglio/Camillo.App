import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl} from "@angular/forms";

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { PatientEntry } from './patient-entry';
import { PatientService } from './patient.service';

@Component({
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

export class PatientComponent implements OnInit {
  pageTitle :string = 'New Patient';
  isEditMode:boolean = true; 
  errorMessage: string;
  patientId:number;
  

  patientForm : FormGroup;
  patient : PatientEntry = new PatientEntry();
  statusList : string[] = [
    "None",
    "Admitted",
    "StillPatient",
    "Discharged"
  ];
  
  private sub: Subscription;

  constructor(private _route: ActivatedRoute,
              private _router:Router,
              private _patientService: PatientService,
              private _fb:FormBuilder) {}

  ngOnInit(): void{
      this.sub = this._route.params.subscribe(
        params => {
            let id = +params['id'];
            this.initForm(id);
            this.getPatient(id);
        }
      );
  }

  initForm(id:number):void{
    this.patientForm  = this._fb.group( {
      firstName : ['',[Validators.required, Validators.minLength(2)]],
      lastName :  ['',[Validators.required, Validators.minLength(2)]],
      medicareNumber : '',
      gender :  '',
      address :  ['',[Validators.required]],
      telephone : ['',[Validators.required]],
      status : ['',[Validators.required]],
      birthDate :  ['',[Validators.required]],
      email : '',
      username : '',
      password : ''
    } );

    //for a new patient I also add Account FormControl Validators
    if(id==0){
      this.isEditMode = false;
      
      const emailControl = this.patientForm.get('email');
      emailControl.setValidators([Validators.required,
                                  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      
      const usernameControl = this.patientForm.get('username');
      usernameControl.setValidators(Validators.required);

      const passwordControl = this.patientForm.get('password');
      usernameControl.setValidators(Validators.required);
    }
 }

  getPatient(id: number): void {
      this._patientService.getPatient(id)
          .subscribe(
              (patient: PatientEntry) => this.onPatientRetrieved(patient),
              (error: any) => this.errorMessage = <any>error
          );
  }

  onPatientRetrieved(patient: PatientEntry): void {
      if (this.patientForm) {
          this.patientForm.reset();
      }

      this.patient = patient;

      if (this.patient.accountId === 0) {
          this.pageTitle = 'New Patient';
      } else {
          this.pageTitle = `Edit : ${this.patient.firstName} ${this.patient.lastName}`;
      }

      // Update the data on the form
      this.patientForm.patchValue({
          firstName: this.patient.firstName,
          lastName: this.patient.lastName,
          medicareNumber : this.patient.madicareNumber,
          gender :  this.patient.gender,
          address :  this.patient.address,
          telephone : this.patient.telephone,
          status : this.patient.status,
          birthDate :  this.patient.birthDate
      });
  }

  deletePatient(): void { 
      if (this.patient.accountId === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
      } else {
            if (confirm(`Really delete the patient: ${this.patient.firstName} ${this.patient.lastName}?`)) {
                this._patientService.deletePatient(this.patient.accountId)
                    .subscribe(
                        () => this.onSaveComplete(),
                        (error: any) => this.errorMessage = <any>error
                    );
              }
      }
  }

  save(): void {
      if (this.patientForm.dirty && this.patientForm.valid) {
          // Copy the form values over the patient object values
          let p = Object.assign({}, this.patient, this.patientForm.value);
          this._patientService.savePatient(p)
              .subscribe(
                  () => this.onSaveComplete(),
                  (error: any) => this.errorMessage = <any>error
              );
      } else if (!this.patientForm.dirty) {
          this.onSaveComplete();
      }
  }

  onSaveComplete(): void {
      // Reset the form to clear the flags
      this.patientForm.reset();
      this._router.navigate(['/patients']);
  }
}
