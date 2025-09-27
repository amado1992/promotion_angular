import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../../common/services/api.service';
import {apiRoutes} from '../../../api-routing';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.providerGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.providerFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.providerAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.providerUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.providerDestroy, params);
    }
}
