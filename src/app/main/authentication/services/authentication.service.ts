import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {apiRoutes} from '../../../api-routing';
import {ApiService} from '../../common/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private _apiService: ApiService) {
    }

    login(credentials: any): Observable<any> {
        return this._apiService.post(apiRoutes.login, credentials);
    }

    getUserData(): Observable<any> {
        return this._apiService.get(apiRoutes.logged_user);
    }

    changePassword(params: any): Observable<any> {
        return this._apiService.patch(apiRoutes.userPassword, params);
    }

    changeAccount(params: any): Observable<any> {
        return this._apiService.put(apiRoutes.userAccount, params);
    }

    logout(): Observable<any> {
        return this._apiService.get(apiRoutes.logout);
    }
}
