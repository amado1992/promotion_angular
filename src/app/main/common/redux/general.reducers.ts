import {Action, createReducer, on} from '@ngrx/store';

import * as generalActions from './general.actions';
import {UserState} from '../../users/redux/users.reducers';
import {RoleState} from '../../roles/redux/roles.reducers';
import {ProductState} from '../../products/redux/products.reducer';
import {CatalogueState} from '../../catalogs/redux/catalogs.reducer';
import {CustomerState} from '../../customers/redux/customers.reducer';
import {ProviderState} from '../../providers/redux/providers.reducer';
import {AuthState} from '../../authentication/redux/authentication.reducers';
import {BranchOfficeState} from '../../branch-offices/redux/branch-offices.reducers';
import {ConfigurationState} from '../../configurations/redux/configurations.reducer';
import { OrdersState } from 'app/main/orders/redux/orders.reducers';
import { InventoriesState } from 'app/main/inventories/redux/inventories.reducers';

export class AppState {
    auth: AuthState;
    general: GeneralState;
    customers: CustomerState;
    branchOffices: BranchOfficeState;
    providers: ProviderState;
    products: ProductState;
    catalogs: CatalogueState;
    users: UserState;
    roles: RoleState;
    configurations: ConfigurationState;
    ordersStore: OrdersState;
    inventoriesStore: InventoriesState;
}

export class GeneralState {
    showLoading: boolean;

    constructor() {
        this.showLoading = true;
    }
}

const _generalReducer = createReducer(
    new GeneralState(),
    on(generalActions.hideLoading, (state, {showLoading}) => {
        return {
            ...state,
            showLoading: showLoading
        };
    }),
    on(generalActions.showLoading, (state, {showLoading}) => {
        return {
            ...state,
            showLoading: showLoading
        };
    })
);

export function generalReducer(state: GeneralState | undefined, action: Action) {
    return _generalReducer(state, action);
}
