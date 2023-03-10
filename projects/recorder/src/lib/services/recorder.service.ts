import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecorderService {

    constructor(private httpClient: HttpClient) { }

    sendVoiceRecord(record: FormData): Observable<any> {
        console.log('formData arrived: ', record.get('voice'))
        return this.httpClient.post<any>('http://localhost:3010/effects', record).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    };
}
