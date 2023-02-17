import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecorderService {

    constructor(private httpClient: HttpClient) { }

    sendVoiceRecord(record: FormData) {
        console.log('formData arrived: ', record.get('voice'))
        this.httpClient.post('/api/post-record', record).pipe(
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
