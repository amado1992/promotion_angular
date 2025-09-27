import {Injectable} from '@angular/core';

import {SessionService} from './session.service';
import {PermissionModel} from '../../roles/models/permission.model';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    constructor(private _sessionService: SessionService) {
    }

    checkPermission(_permission: PermissionModel) {
        const user = this._sessionService.getUserModel();
        if (user && user.role.name === 'Super Administrador') {
            return true;
        } else if (user && user.role.permissions) {
            for (const permission of user.role.permissions) {
                if (permission.name === _permission.name) {
                    return true;
                }
            }
        }
        return false;
    }

    checkPermissionValues(_permissions: { read: string, create: string, update: string, destroy: string }) {
        return {
            read: this.checkPermission({name: _permissions.read}),
            create: this.checkPermission({name: _permissions.create}),
            update: this.checkPermission({name: _permissions.update}),
            destroy: this.checkPermission({name: _permissions.destroy})
        };
    }
}
