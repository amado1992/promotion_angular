import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../../common/services/api.service';
import {apiRoutes} from '../../../api-routing';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.customerGet);
    }

    getBySearch(params: any): Observable<any> {
        return this._apiService.getBySearch(apiRoutes.customerGetBySearch, params);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.customerFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.customerAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.customerUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.customerDestroy, params);
    }
}
