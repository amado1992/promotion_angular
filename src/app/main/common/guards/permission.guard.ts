import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {PermissionService} from '../services/permission.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

    constructor(private _permissionService: PermissionService,
                private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this._permissionService.checkPermission({name: route.data.permission})) {
            this._router.navigate(['/dashboard']).then();
            return false;
        }
        return true;
    }
}
