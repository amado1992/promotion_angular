import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../../common/services/api.service';
import {apiRoutes} from '../../../api-routing';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.catalogueGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.catalogueFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.catalogueAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.catalogueUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.catalogueDestroy, params);
    }
}
