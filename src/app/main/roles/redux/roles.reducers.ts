import {Action, createReducer, on} from '@ngrx/store';

import * as rolesActions from './roles.actions';
import {GeneralUtil} from '../../common/utils/general.util';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import {FilterModel} from '../../common/models/filter.model';
import {RoleModel} from '../models/rol.model';

export class RoleState {
    roles: DataWithFilter<RoleModel>;

    constructor() {
        this.roles = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _rolesReducer = createReducer(
    new RoleState(),
    on(rolesActions.filterAllRoles, (state, {filter}) => ({
        ...state,
        roles: GeneralUtil.setWithFilter(filter, state.roles.value, state.roles.total)
    })),
    on(rolesActions.filterAllRolesComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.roles.filter};
        return {
            ...state,
            roles: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function rolesReducer(state: RoleState | undefined, action: Action) {
    return _rolesReducer(state, action);
}
