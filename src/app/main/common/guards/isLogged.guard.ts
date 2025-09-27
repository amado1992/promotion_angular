import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {SessionService} from '../services/session.service';

@Injectable({
    providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

    constructor(private _sessionService: SessionService,
                private _router: Router) {
    }

    canActivate() {
        return this.canLoad();
    }

    canLoad() {
        if (!this._sessionService.getUserModel()) {
            this._router.navigate(['/login']).then();
            return false;
        }
        return true;
    }
}
