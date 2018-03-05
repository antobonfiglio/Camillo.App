import { Component, OnInit } from "@angular/core";
import { IPatientSummary } from "./patient-summary";
import { PatientService } from "./patient.service";

@Component({
    templateUrl:'./patient-list.component.html',
    styleUrls:['./patient-list.component.css']
})

export class PatientListComponent implements OnInit{
   
    pageTitle: String = 'Patients';
    showImage: boolean = false;
    errorMessage : string;

    imageWidth: number=50;
    imageMargin: number=2;
    
    _listFilter : string;

    filteredPatients : IPatientSummary[];
    patients: IPatientSummary[] = [];

    constructor(private _productService:PatientService){}

    get listFilter() : string {
        return this._listFilter;
    }

    set listFilter(value:string) {
        this._listFilter = value
        this.filteredPatients = this.listFilter ? 
                                this.performFilter(this.listFilter) : 
                                this.patients; 
    }

    performFilter(filterBy:string) :IPatientSummary[]{
        filterBy = filterBy.toLocaleLowerCase();

        return this.patients.filter((patient: IPatientSummary) => 
                    patient.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    ngOnInit(): void {
        this._productService.getPatients()
                            .subscribe(patients => {
                                this.patients = patients.results;
                                this.filteredPatients = this.patients;
                            }, error => this.errorMessage = <any>error);
    }
}
