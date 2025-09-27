import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';
import {Filter, FilterModel} from '../../common/models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class ConsignmentNoteService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.consignmentNoteGet);
    }

    filterAll(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.consignmentNoteFilter, filterModel);
    }

    add(params: any): Observable<any> {
        return this._apiService.post(apiRoutes.consignmentNoteAdd, params);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.consignmentNoteUpdate, params);
    }

    destroy(params: any): Observable<any> {
        return this._apiService.delete(apiRoutes.consignmentNoteDestroy, params);
    }

    getFile(params: any): Observable<any> {
        return this._apiService.getFile(apiRoutes.consignmentNoteGetFile, params);
    }

    getFileWithoutTotals(params: any): Observable<any> {
        return this._apiService.getFile(apiRoutes.consignmentNoteGetFileWithoutTotals, params);
    }

    sendFileByEmail(params: any): Observable<any> {
        let path = apiRoutes.consignmentNoteSendFileByEmail;
        path = path.replace('{id}', params.id);
        return this._apiService.get(path);
    }

    exportExcelConsignmentNotes(filters: Filter[]): Observable<any> {
        return this._apiService.getExportExcel(apiRoutes.consignmentNoteAllExportExcel, filters);
    }

    stamp(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.consignmentNoteStamp, params);
    }

    xmlStamp(params: any): Observable<any> {
        return this._apiService.getById(apiRoutes.consignmentNoteXMLStamp, params);
    }

    cancelStamp(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.consignmentNoteCancelStamp, params);
    }

    checkCancelStamp(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.consignmentNoteCheckCancelStamp, params);
    }

    getFileAcknowledgeCancel(params: any): Observable<any> {
        return this._apiService.getFile(apiRoutes.consignmentNoteGetFileAcknowledgeCancel, params);
    }

    filterAllForInformations(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.consignmentNoteFilterForInformations, filterModel);
    }

    filterAllStampForInformations(filterModel: FilterModel): Observable<any> {
        return this._apiService.filterAll(apiRoutes.consignmentNoteFilterStampForInformations, filterModel);
    }

    updatePaymentCreditStatus(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.consignmentNoteUpdatePaymentCreditStatus, params);
    }

    filterAllConsignmentNotesByCustomer(id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.consignmentNoteFilterByCustomer;
        path = path.replace('{id}', id);
        return this._apiService.filterAll(path, filterModel);
    }

    filterAllConsignmentNotesCancelRelated(id, filterModel: FilterModel): Observable<any> {
        let path = apiRoutes.consignmentNoteFilterCancelRelated;
        path = path.replace('{id}', id);
        return this._apiService.filterAll(path, filterModel);
    }

    delivery(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.consignmentNoteDelivery, params);
    }
}
