import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Filter, FilterModel } from '../models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = environment.apiUrl;
    private protocol = environment.protocol;

    constructor(private _httpClient: HttpClient) {
    }

    filterAll(path: string, filterModel: FilterModel): Observable<any> {
        let params = filterModel.search;
        if (filterModel.filters.length > 0) {
            const filters = filterModel.filters.reduce(
                (filtersList, filter: Filter) => [...filtersList, [filter.attribute, filter.operator, filter.value]],
                []
            );

            params = { ...params, filter: JSON.stringify(filters) };
        }

        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, { params });
    }

    get(path: string): any {
        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`);
    }

    getBySearch(path: string, params: any): any {
        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, { params });
    }

    getById(path: string, params: any): any {
        path = path.replace('{id}', params.id);
        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    post(path: string, params: any): any {
        return this._httpClient.post(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    put(path: string, params: any): any {
        path = path.replace('{id}', params.id);
        return this._httpClient.put(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    delete(path: string, params: any): any {
        path = path.replace('{id}', params.id);
        return this._httpClient.delete(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    patch(path: string, params: any) {
        path = path.replace('{id}', params.id);
        return this._httpClient.patch(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    postWithFile(path: string, params: any): any {
        return this._httpClient.post(`${this.protocol}//${this.baseUrl}${path}`, params, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            catchError(function (error: HttpErrorResponse) {
                if (error.error instanceof ErrorEvent) {
                    return throwError(error.error.message);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    getFile(path: string, params: any) {
        path = path.replace('{id}', params.id);
        return this._httpClient.post(`${this.protocol}//${this.baseUrl}${path}`, params, {
            responseType: 'blob' as 'json'
        });
    }

    getExportExcelById(path: string, params: any) {
        path = path.replace('{id}', params.id);
        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, { params });
    }

    getExportExcel(path: string, filterModel: FilterModel): Observable<any> {
        let params = filterModel.search;
        if (filterModel.filters.length > 0) {
            const filters = filterModel.filters.reduce(
                (filtersList, filter: Filter) => [...filtersList, [filter.attribute, filter.operator, filter.value]],
                []
            );

            params = { ...params, filter: JSON.stringify(filters) };
        }

        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, { params });
    }

    putOrder(path: string, params: any): any {
        path = path.replace('{id}', params.folio);
        return this._httpClient.put(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    deleteOrder(path: string, params: any): any {
        path = path.replace('{id}', params.id);
        return this._httpClient.delete(`${this.protocol}//${this.baseUrl}${path}`, params);
    }

    getProductsBySearch(path: string, params: HttpParams): Observable<any> {
        const url = `${this.protocol}//${this.baseUrl}${path}`;
        return this._httpClient.get(url, { params }).pipe(
            catchError((error) => {
                console.error('Error in the request:', error);
                return throwError(() => new Error('Error in obtaining products'));
            })
        );
    }

    getByHttpParams(path: string, requestParameters: any): Observable<any> {
        const url = `${this.protocol}//${this.baseUrl}${path}`;

        const params = new HttpParams()
            .set('orderId', requestParameters.orderId)
            .set('name', requestParameters.name);

        return this._httpClient.get(url, {
            params: params,
            responseType: 'blob'
        }).pipe(
            catchError((error) => {
                console.error('Error in the request:', error);
                return throwError(() => new Error('An error occurs'));
            })
        );
    }

    getByHttpParamsPrintInventory(path: string, requestParameters: any): Observable<any> {
        const url = `${this.protocol}//${this.baseUrl}${path}`;

        const params = new HttpParams()
            .set('inventoryId', requestParameters.inventoryId)
            .set('name', requestParameters.name)
            .set('motiveMovementId', requestParameters.motiveMovementId)

        return this._httpClient.get(url, {
            params: params,
            responseType: 'blob'
        }).pipe(
            catchError((error) => {
                console.error('Error in the request:', error);
                return throwError(() => new Error('An error occurs'));
            })
        );
    }

    filterAllResponseTypeBlob(path: string, filterModel: FilterModel): Observable<any> {
        let params = filterModel.search;
        if (filterModel.filters.length > 0) {
            const filters = filterModel.filters.reduce(
                (filtersList, filter: Filter) => [...filtersList, [filter.attribute, filter.operator, filter.value]],
                []
            );

            params = { ...params, filter: JSON.stringify(filters) };
        }

        return this._httpClient.get(`${this.protocol}//${this.baseUrl}${path}`, { params, responseType: 'blob' });
    }
}
