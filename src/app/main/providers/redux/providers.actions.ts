import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const getAllProviders = createAction('[Providers] Get All Providers');
export const getAllProvidersComplete = createAction('[Providers] Get All Providers Complete', props<{ data: any }>());
export const filterAllProviders = createAction('[Providers] Filter All Providers', props<{ filter: FilterModel }>());
export const filterAllProvidersComplete = createAction('[Providers] Filter All Providers Complete', props<{ data: any }>());
export const addNewProvider = createAction('[Providers] Add New Provider', props<{ params: any }>());
export const addNewProviderComplete = createAction('[Providers] Add New Provider Complete', props<{ data: any }>());
export const saveProvider = createAction('[Providers] Save Provider', props<{ params: any }>());
export const saveProviderComplete = createAction('[Providers] Save Provider Complete', props<{ data: any }>());
export const updateProvider = createAction('[Providers] Update Provider', props<{ params: any }>());
export const updateProviderComplete = createAction('[Providers] Update Provider Complete', props<{ data: any }>());
export const destroyProvider = createAction('[Providers] Destroy Provider', props<{ params: any }>());
export const destroyProviderComplete = createAction('[Providers] Destroy Provider Complete', props<{ data: any }>());

export const getAllProviderAccounts = createAction('[Providers] Get All Provider Accounts', props<{id: number}>());
export const getAllProviderAccountsComplete = createAction('[Providers] Get All Provider Accounts Complete', props<{ data: any }>());
export const filterAllProviderAccounts = createAction('[Providers] Filter All Provider Accounts', props<{ id: number, filter: FilterModel }>());
export const filterAllProviderAccountsComplete = createAction('[Providers] Filter All Provider Accounts Complete', props<{ data: any }>());
export const addNewProviderAccount = createAction('[Providers] Add New Provider Account', props<{ id: number, params: any }>());
export const addNewProviderAccountComplete = createAction('[Providers] Add New Provider Account Complete', props<{ data: any }>());
export const updateProviderAccount = createAction('[Providers] Update Provider Account', props<{ params: any }>());
export const updateProviderAccountComplete = createAction('[Providers] Update Provider Account Complete', props<{ data: any }>());
export const destroyProviderAccount = createAction('[Providers] Destroy Provider Account', props<{ params: any }>());
export const destroyProviderAccountComplete = createAction('[Providers] Destroy Provider Account Complete', props<{ data: any }>());
export const changeStatusProviderAccount = createAction('[Providers] Change Status Provider Account', props<{ params: any }>());
export const changeStatusProviderAccountComplete = createAction('[Providers] Change Status Provider Account Complete', props<{ data: any }>());
