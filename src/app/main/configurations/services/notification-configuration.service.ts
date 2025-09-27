import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationConfigurationService {

    constructor(private _apiService: ApiService) {
    }

    get(): Observable<any> {
        return this._apiService.get(apiRoutes.notificationConfigurationGet);
    }

    update(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.notificationConfigurationUpdate, params);
    }
}
