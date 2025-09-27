import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class BranchOfficeService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.branchOfficeGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.branchOfficeFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.branchOfficeAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.branchOfficeUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.branchOfficeDestroy, params);
    }
}
