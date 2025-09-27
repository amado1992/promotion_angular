import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const getAllCustomers = createAction('[Customers] Get All Customers');
export const getAllCustomersComplete = createAction('[Customers] Get All Customers Complete', props<{ data: any }>());
export const getAllCustomersBySearch = createAction('[Customers] Get All Customers By Search', props<{ params: any }>());
export const getAllCustomersBySearchComplete = createAction('[Customers] Get All Customers By Search Complete', props<{ data: any }>());
export const filterAllCustomers = createAction('[Customers] Filter All Customers', props<{ filter: FilterModel }>());
export const filterAllCustomersComplete = createAction('[Customers] Filter All Customers Complete', props<{ data: any }>());
export const addNewCustomer = createAction('[Customers] Add New Customer', props<{ params: any }>());
export const addNewCustomerComplete = createAction('[Customers] Add New Customer Complete', props<{ data: any }>());
export const saveCustomer = createAction('[Customers] Save Customer', props<{ params: any }>());
export const saveCustomerComplete = createAction('[Customers] Save Customer Complete', props<{ data: any }>());
export const updateCustomer = createAction('[Customers] Update Customer', props<{ params: any }>());
export const updateCustomerComplete = createAction('[Customers] Update Customer Complete', props<{ data: any }>());
export const destroyCustomer = createAction('[Customers] Destroy Customer', props<{ params: any }>());
export const destroyCustomerComplete = createAction('[Customers] Destroy Customer Complete', props<{ data: any }>());

export const getAllCustomerAccounts = createAction('[Customers] Get All Customer Accounts', props<{id: number}>());
export const getAllCustomerAccountsComplete = createAction('[Customers] Get All Customer Accounts Complete', props<{data: any}>());
export const filterAllCustomerAccounts = createAction('[Customers] Filter All Customer Accounts', props<{ id: number, filter: FilterModel }>());
export const filterAllCustomerAccountsComplete = createAction('[Customers] Filter All Customer Accounts Complete', props<{ data: any }>());
export const addNewCustomerAccount = createAction('[Customers] Add New Customer Account', props<{ id: number, params: any }>());
export const addNewCustomerAccountComplete = createAction('[Customers] Add New Customer Account Complete', props<{ data: any }>());
export const updateCustomerAccount = createAction('[Customers] Update Customer Account', props<{ params: any }>());
export const updateCustomerAccountComplete = createAction('[Customers] Update Customer Account Complete', props<{ data: any }>());
export const destroyCustomerAccount = createAction('[Customers] Destroy Customer Account', props<{ params: any }>());
export const destroyCustomerAccountComplete = createAction('[Customers] Destroy Customer Account Complete', props<{ data: any }>());
export const changeStatusCustomerAccount = createAction('[Customers] Change Status Customer Account', props<{ params: any }>());
export const changeStatusCustomerAccountComplete = createAction('[Customers] Change Status Customer Account Complete', props<{ data: any }>());
