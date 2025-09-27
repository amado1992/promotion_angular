import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {apiRoutes} from "../../../api-routing";
import {ApiService} from "../../common/services/api.service";
import {FilterModel} from "../../common/models/filter.model";

@Injectable({
    providedIn: 'root'
})
export class AccountConfigurationService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.accountConfigurationGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.accountConfigurationFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.accountConfigurationAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.accountConfigurationUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.accountConfigurationDestroy, params);
    }

    changeStatus(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.accountConfigurationChangeStatus, params);
    }
}
