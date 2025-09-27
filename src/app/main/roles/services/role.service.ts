import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(private _apiService: ApiService) {
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.roleFilter, filterModel);
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.roleGet);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.roleAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.roleUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.roleDestroy, params);
    }
}
