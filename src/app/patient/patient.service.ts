import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private _http: HttpClient) {}

  private patients$ = new BehaviorSubject<any[]>([]);
  set patients(patients: any[]) {
    this.patients$.next(patients);
  }

  patientsSub(): Observable<any[]> {
    return this.patients$.asObservable().pipe(filter((x) => !!x));
  }

  getPatients(body: any = {}) {
    return this._http.post<any[]>(
      `${environment.serverUrl}/api/patients/list`,
      body
    );
  }

  createPatient(body: any) {
    return this._http.post(`${environment.serverUrl}/api/patients/`, body, {
      reportProgress: true,
      observe: 'events',
    });
  }

  addPatient(patient: any) {
    this.patients$.next([...this.patients$.value, patient]);
  }

  updatePatient(body: any, lockerId: any) {
    return this._http.put(
      `${environment.serverUrl}/api/patients/${lockerId}`,
      body,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  modifyPatient(patient: any) {
    const newPatientArr = this.patients$.value.map((obj) => {
      if (obj.lockerId === patient.lockerId)
        return {
          ...obj,
          ...patient,
        };
      return obj;
    });
    this.patients$.next(newPatientArr);
  }
}
