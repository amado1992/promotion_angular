import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiRoutes } from '../../../api-routing';
import { Filter, FilterModel } from '../../common/models/filter.model';
import { ApiService } from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class InventoriesService {

    constructor(private _apiService: ApiService) {
    }
    
    addInventory(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.inventoryAdd, params);
    }

    filterAllInventories(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.inventoryFilter, filterModel);
    }

    destroyInventory(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.inventoryDestroy, params);
    }

    updateInventory(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.inventoryUpdate, params);
    }

    exportExcelInventory(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.inventoryExportExcel, filterModel);
    }

    adjustmentMovementsByInventoryId(inventory_id, params: any): Observable<any> {
        let path = apiRoutes.adjustmentMovements;
        path = path.replace('{id}', inventory_id);
        return this._apiService.post(path, params);
    }

    filterAllMovementsByInventoryId(inventory_id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.inventoryMovementsFilter;
        path = path.replace('{id}', inventory_id);
        return this._apiService.filterAll(path, filterModel);
    }

    getInventoryPdf(params: any): Observable<any> {
        return this._apiService.getByHttpParamsPrintInventory(apiRoutes.inventoryPdf, params);
    }

    getIntoryMovements(inventory_id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.inventoryPdf;
        path = path.replace('{id}', inventory_id);
        return this._apiService.filterAllResponseTypeBlob(path, filterModel);
    }

    updateMovement(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.movementUpdateAndDestroy, params);
    }

    destroyMovement(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.movementUpdateAndDestroy, params);
    }
}
