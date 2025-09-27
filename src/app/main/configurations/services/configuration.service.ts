import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../../common/services/api.service';
import {apiRoutes} from '../../../api-routing';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.configurationGet);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.configurationUpdate, params);
    }
}
