import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiRoutes } from '../../../api-routing';
import { Filter, FilterModel } from '../../common/models/filter.model';
import { ApiService } from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    constructor(private _apiService: ApiService) {
    }
    
    addOrder(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.orderAdd, params);
    }

    filterAllOrders(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.orderFilter, filterModel);
    }

    destroyOrder(params: any): Observable<any> {
        return this._apiService.deleteOrder(apiRoutes.orderDestroy, params);
    }

    updateOrder(params: any): Observable<any> {
        return this._apiService.putOrder(apiRoutes.orderUpdate, params);
    }

    exportExcelOrder(filterModel: FilterModel): Observable<any> {
        return this._apiService.getExportExcel(apiRoutes.orderExportExcel, filterModel);
    }

    getTopBranchOffices(): Observable<any> {
        return this._apiService.get(apiRoutes.orderTopBranchOffices);
    }

    getTopProducts(): Observable<any> {
        return this._apiService.get(apiRoutes.orderTopProducts);
    }

    getTotals(): Observable<any> {
        return this._apiService.get(apiRoutes.orderTotals);
    }

    getOrderPdf(params: any): Observable<any> {
        return this._apiService.getByHttpParams(apiRoutes.orderPdf, params);
    }
}
