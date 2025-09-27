import {BranchOfficeModel} from '../../branch-offices/models/branch-office.model';
import {RoleModel} from '../../roles/models/rol.model';

export class UserModel {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: number;
    status: string;
    avatar: string;
    branch_office: BranchOfficeModel;
    role: RoleModel;
}

export class Credentials {
    email: string;
    password: string;
}

export class Tokens {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expire_date_unix: number;
    user: UserModel;
    is_refreshing: boolean;
}
