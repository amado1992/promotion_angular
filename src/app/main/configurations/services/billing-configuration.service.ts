import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class BillingConfigurationService {

    constructor(private _apiService: ApiService) {
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.billingConfigurationUpdate, params);
    }
}
