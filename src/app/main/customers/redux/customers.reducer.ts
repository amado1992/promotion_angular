import {Action, createReducer, on} from '@ngrx/store';

import {CustomerModel} from '../models/customer.model';
import {GeneralUtil} from '../../common/utils/general.util';
import {FilterModel} from '../../common/models/filter.model';
import {CustomerAccountModel} from "../models/customer-account.model";
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import * as customersActions from '../../customers/redux/customers.actions';

export class CustomerState {
    customer: CustomerModel;
    customers: DataWithFilter<CustomerModel>;
    customerAccounts: DataWithFilter<CustomerAccountModel>;

    constructor() {
        this.customers = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
        this.customerAccounts = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _customersReducer = createReducer(
    new CustomerState(),
    on(customersActions.filterAllCustomers, (state, {filter}) => ({
        ...state,
        customers: GeneralUtil.setWithFilter(filter, state.customers.value, state.customers.total)
    })),
    on(customersActions.filterAllCustomersComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.customers.filter};
        return {
            ...state,
            customers: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    }),
    on(customersActions.saveCustomer, (state, {params}) => {
        return {
            ...state,
            customer: params
        };
    }),
    on(customersActions.filterAllCustomerAccounts, (state, {filter}) => ({
        ...state,
        customerAccounts: GeneralUtil.setWithFilter(filter, state.customerAccounts.value, state.customerAccounts.total)
    })),
    on(customersActions.filterAllCustomerAccountsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.customerAccounts.filter};
        return {
            ...state,
            customerAccounts: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function customersReducer(state: CustomerState | undefined, action: Action) {
    return _customersReducer(state, action);
}
