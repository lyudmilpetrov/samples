import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, from, BehaviorSubject, Subject, Subscription, AsyncSubject, of, throwError } from 'rxjs';
import { map, filter, scan, catchError, mergeMap, debounceTime, distinctUntilChanged, switchMap, retry } from 'rxjs/operators';
import { FilesJsonInfo, UserInfo } from 'src/app/shared/globals';
import { BarChart, DataBarChart, DataLineChart, HSLAObject, IDataSample1, JSONFile, LineChart, SliderInfo } from '../data-models/data-models';
import { Optional } from '@angular/core';
import { SkipSelf } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class APIsServices {
    constructor(
        // @Optional() @SkipSelf() parentModule: APIsServices,
        private httpClient: HttpClient
    ) {
        // if (parentModule) {
        //     throw new Error(
        //         'CoreModule is already loaded. Import it in the AppModule only');
        // }
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        return throwError(`Backend returned code ${error.status}, body was: ${error.error}, message was: ${error.message}`);
    }
    fileExists(url: string): Observable<boolean> {
        return this.httpClient.get(url).pipe(map(() => true), catchError(() => of(false)));
    }
    getJSON(filepath: string) {
        return this.httpClient.get<JSONFile>((filepath)).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }
    getJSON_1(filepath: string) {
        return this.httpClient.get((filepath));
    }
    getJSON_2(filepath: string) {
        return this.httpClient.get<JSONFile>((filepath));
    }
    getJSON_3(filepath: string) {
        return this.httpClient.get<JSONFile>((filepath)).pipe(
            catchError(this.handleError)
        );
    }
}
