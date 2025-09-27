import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class PacConfigurationService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.pacConfigurationGet);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.pacConfigurationUpdate, params);
    }
}
