import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response, Headers} from "@angular/http"
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { PatientEntry } from "./patient-entry";

@Injectable()
export class PatientService {
    //private baseUrl ='./api/patients/patients.json';
    private baseUrl ='http://camilloapi.azurewebsites.net/api/patients/';

    constructor(private _http: Http){}

    getPatients() : Observable<any> {
        return this._http.get(this.baseUrl)
        .map(this.extractData)
        .do(data => console.log('All:'+JSON.stringify(data) ) )
        .catch(this.handleError);
    }

    getPatient(id: number): Observable<PatientEntry> {
        if (id === 0) {
            return Observable.of(new PatientEntry());
        }

        const url = `${this.baseUrl}/${id}`;
        return  this._http.get(url)
        .map(this.extractData)
        .do(data => console.log('getPatient:'+JSON.stringify(data) ) )
        .catch(this.handleError);
    }

    savePatient(patient:PatientEntry): Observable<PatientEntry> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        if (patient.accountId === 0) {
            return this.createPatient(patient, options);
        }
        return this.updatePatient(patient, options);
    }

    deletePatient(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this._http.delete(url, options)
            .do(data => console.log('deletePatient ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
     
    private createPatient(product: PatientEntry, options: RequestOptions): Observable<PatientEntry> {
        return this._http.post(this.baseUrl, product, options)
            .map(this.extractData)
            .do(data => console.log('createPatient: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updatePatient(patient: PatientEntry, options: RequestOptions): Observable<PatientEntry> {
        const url = `${this.baseUrl}/${patient.accountId}`;
        return this._http.put(url, patient, options)
            .map(()=>patient)
            .do(data => console.log('updatePatient: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body || {};
    }

    private handleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return Observable.throw(errorMessage);
    }   
}