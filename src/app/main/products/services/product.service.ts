import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../../common/services/api.service';
import {apiRoutes} from '../../../api-routing';
import {FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.productGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.productFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.productAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.productUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.productDestroy, params);
    }

    getBySearch(params: any): Observable<any> {
        return this._apiService.getProductsBySearch(apiRoutes.productGetBySearch, params);
    }

    getProductsBySearch(params: any): Observable<any> {
        return this._apiService.getProductsBySearch(apiRoutes.productGetBySearchGeneral, params);
    }
}
