import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private _apiService: ApiService) {
    }

    getAllData(): Observable<any> {
        return this._apiService.get(apiRoutes.dashboardGetAllData);
    }
}
