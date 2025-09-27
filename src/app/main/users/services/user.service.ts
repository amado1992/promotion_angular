import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.userGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.userFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.userAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.userUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.userDestroy, params);
    }

    changeStatus(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.userStatus, params);
    }

    getUsersByRole(params: any): Observable<any> {
        return this._apiService.getBySearch(apiRoutes.usersByRole, params);
    }
}
