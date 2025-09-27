import {Action, createReducer, on} from '@ngrx/store';

import {ProviderModel} from '../models/provider.model';
import {GeneralUtil} from '../../common/utils/general.util';
import {FilterModel} from '../../common/models/filter.model';
import {ProviderAccountModel} from "../models/provider-account.model";
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import * as providersActions from '../../providers/redux/providers.actions';

export class ProviderState {
    provider: ProviderModel;
    providers: DataWithFilter<ProviderModel>;
    providerAccounts: DataWithFilter<ProviderAccountModel>;

    constructor() {
        this.providers = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
        this.providerAccounts = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _providersReducer = createReducer(
    new ProviderState(),
    on(providersActions.filterAllProviders, (state, {filter}) => ({
        ...state,
        providers: GeneralUtil.setWithFilter(filter, state.providers.value, state.providers.total)
    })),
    on(providersActions.filterAllProvidersComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.providers.filter};
        return {
            ...state,
            providers: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    }),
    on(providersActions.saveProvider, (state, {params}) => {
        return {
            ...state,
            provider: params
        };
    }),
    on(providersActions.filterAllProviderAccounts, (state, {filter}) => ({
        ...state,
        providerAccounts: GeneralUtil.setWithFilter(filter, state.providerAccounts.value, state.providerAccounts.total)
    })),
    on(providersActions.filterAllProviderAccountsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.providerAccounts.filter};
        return {
            ...state,
            providerAccounts: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function providersReducer(state: ProviderState | undefined, action: Action) {
    return _providersReducer(state, action);
}
