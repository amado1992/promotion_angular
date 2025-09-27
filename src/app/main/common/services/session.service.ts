import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {UserModel} from '../../users/models/user.model';
import {AppState} from '../redux/general.reducers';
import {apiRoutes} from '../../../api-routing';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private access_token: string;
    private refresh_token: string;
    private token_expire_date_unix: number;
    private user: UserModel;

    constructor(private _store: Store<AppState>,
                private _apiService: ApiService) {
        this._store.subscribe(state => {
            if (state.auth && state.auth.auth) {
                this.access_token = state.auth.auth.access_token;
                this.refresh_token = state.auth.auth.refresh_token;
                this.token_expire_date_unix = state.auth.auth.expire_date_unix;
                this.user = state.auth.auth.user;
            }
        });
    }

    refreshToken(): Observable<any> {
        return this._apiService.post(apiRoutes.refresh_token, {refresh_token: this.refresh_token});
    }

    getUserModel(): UserModel {
        return this.user;
    }

    isLoggedIn() {
        const timeNow = new Date().getTime();
        if (this.user && timeNow > this.token_expire_date_unix) {
            return false;
        }
        if (!this.user) {
            return false;
        }

        return true;
    }
}
