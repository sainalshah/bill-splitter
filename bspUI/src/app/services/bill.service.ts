import { map } from 'rxjs/operators';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../../app.constants';
import { Bill } from '../models/bill';

@Injectable()
export class BillService {

    private actionUrl: string;

    constructor(private http: HttpClient, private _configuration: Configuration) {
        this.actionUrl = _configuration.ServerWithApiUrl + 'bills/';
    }

    public getAll(): Observable<Bill[]> {
        console.log('trying to make api call for bills');
        const res = this.http.get<Bill[]>(this.actionUrl);
        console.log('received bills:', res);
        return res;
    }

    public getSingle(id: number): Observable<Bill> {
        return this.http.get<Bill>(this.actionUrl + id);
    }

    public add<T>(bill: Bill): Observable<T> {
        const toAdd = JSON.stringify(bill);

        return this.http.post<T>(this.actionUrl, toAdd);
    }

    public update<T>(id: number, bill: Bill): Observable<T> {
        return this.http
            .put<T>(this.actionUrl + id, JSON.stringify(bill));
    }

    public delete<T>(id: number): Observable<T> {
        return this.http.delete<T>(this.actionUrl + id);
    }
}


