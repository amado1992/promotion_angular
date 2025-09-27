import {Action, createReducer, on} from '@ngrx/store';

import * as branchOfficesActions from './branch-offices.actions';
import {BranchOfficeModel} from '../models/branch-office.model';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import {FilterModel} from '../../common/models/filter.model';
import {GeneralUtil} from '../../common/utils/general.util';

export class BranchOfficeState {
    branchOffices: DataWithFilter<BranchOfficeModel>;

    constructor() {
        this.branchOffices = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _branchOfficesReducer = createReducer(
    new BranchOfficeState(),
    on(branchOfficesActions.filterAllBranchOffices, (state, {filter}) => ({
        ...state,
        branchOffices: GeneralUtil.setWithFilter(filter, state.branchOffices.value, state.branchOffices.total)
    })),
    on(branchOfficesActions.filterAllBranchOfficesComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.branchOffices.filter};
        return {
            ...state,
            branchOffices: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function branchOfficesReducer(state: BranchOfficeState | undefined, action: Action) {
    return _branchOfficesReducer(state, action);
}
