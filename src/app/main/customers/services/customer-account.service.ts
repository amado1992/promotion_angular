import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {apiRoutes} from "../../../api-routing";
import {ApiService} from "../../common/services/api.service";
import {FilterModel} from "../../common/models/filter.model";

@Injectable({
    providedIn: 'root'
})
export class CustomerAccountService {

    constructor(private _apiService: ApiService) {
    }

    get(id): Observable<any> {
        let path = apiRoutes.customerAccountGet;
        path = path.replace('{id}', id);
        return this._apiService.get(path);
    }

    filterAll(id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.customerAccountFilter;
        path = path.replace('{id}', id);
        return this._apiService.filterAll(path, filterModel);
    }

    add(id, params: any): Observable<any> {
        let path = apiRoutes.customerAccountAdd;
        path = path.replace('{id}', id);
        return this._apiService.post(path, params);
    }

    update(params: any): Observable<any> {
        let path = apiRoutes.customerAccountUpdate;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.put(path, params);
    }

    destroy(params: any): Observable<any> {
        let path = apiRoutes.customerAccountDestroy;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.delete(path, params);
    }

    changeStatus(params: any): Observable<any> {
        let path = apiRoutes.customerAccountChangeStatus;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.patch(path, params);
    }
}
