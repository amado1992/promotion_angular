import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {apiRoutes} from "../../../api-routing";
import {FilterModel} from "../../common/models/filter.model";
import {ApiService} from "../../common/services/api.service";

@Injectable({
    providedIn: 'root'
})
export class ProviderAccountService {

    constructor(private _apiService: ApiService) {
    }

    get(id): Observable<any> {
        let path = apiRoutes.providerAccountGet;
        path = path.replace('{id}', id);
        return this._apiService.get(path);
    }

    filterAll(id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.providerAccountFilter;
        path = path.replace('{id}', id);
        return this._apiService.filterAll(path, filterModel);
    }

    add(id, params: any): Observable<any> {
        let path = apiRoutes.providerAccountAdd;
        path = path.replace('{id}', id);
        return this._apiService.post(path, params);
    }

    update(params: any): Observable<any> {
        let path = apiRoutes.providerAccountUpdate;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.put(path, params);
    }

    destroy(params: any): Observable<any> {
        let path = apiRoutes.providerAccountDestroy;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.delete(path, params);
    }

    changeStatus(params: any): Observable<any> {
        let path = apiRoutes.providerAccountChangeStatus;
        path = path.replace('{account_id}', params.account_id);
        return this._apiService.patch(path, params);
    }
}
