import {Action, createReducer, on} from '@ngrx/store';

import * as usersActions from './users.actions';
import {GeneralUtil} from '../../common/utils/general.util';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import {FilterModel} from '../../common/models/filter.model';
import {UserModel} from '../models/user.model';

export class UserState {
    users: DataWithFilter<UserModel>;

    constructor() {
        this.users = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _usersReducer = createReducer(
    new UserState(),
    on(usersActions.filterAllUsers, (state, {filter}) => ({
        ...state,
        users: GeneralUtil.setWithFilter(filter, state.users.value, state.users.total)
    })),
    on(usersActions.filterAllUsersComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.users.filter};
        return {
            ...state,
            users: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function usersReducer(state: UserState | undefined, action: Action) {
    return _usersReducer(state, action);
}
