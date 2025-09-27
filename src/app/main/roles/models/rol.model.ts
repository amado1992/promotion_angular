import {PermissionModel} from './permission.model';

export class RoleModel {
    id: number;
    name: string;
    permissions?: PermissionModel[];
}
