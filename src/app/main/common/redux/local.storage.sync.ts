import {ActionReducer, MetaReducer} from '@ngrx/store';
import {localStorageSync} from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({
        keys: [
            'auth',
            'general',
            'consignmentNotes',
            'informations',
            'informationBlocks',
            'paymentCredits',
            'liquidations',
            'banks',
            'invoices',
            'debitNotes',
            'complements',
            'creditNotes',
            'customers',
            'branchOffices',
            'providers',
            'operators',
            'persons',
            'trailers',
            'trucks',
            'products',
            'catalogs',
            'users',
            'roles',
            'travels',
            'foreingTravels',
            'ordersStore',
            'inventoriesStore'
        ],
        'rehydrate': true
    })(reducer);
}

export function clearState(reducer) {
    return function (state, action) {
        return reducer(state, action);
    };
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, clearState];
