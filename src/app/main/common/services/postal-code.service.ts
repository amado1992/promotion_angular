import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {apiRoutes} from '../../../api-routing';

@Injectable({
    providedIn: 'root'
})
export class PostalCodeService {

    constructor(private _apiService: ApiService) {
    }

    getByPostalCode(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.postalCodeUbications, params);
    }
}
