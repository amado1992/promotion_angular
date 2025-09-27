import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';
import { FilterUserModel } from 'app/main/common/models/filter-user.model';

export const getAllUsers = createAction('[Users] Get All Users');
export const getAllUsersComplete = createAction('[Users] Get All Users Complete', props<{ data: any }>());
export const filterAllUsers = createAction('[Users] Filter All Users', props<{ filter: FilterModel }>());
export const filterAllUsersComplete = createAction('[Users] Filter All Users Complete', props<{ data: any }>());
export const addNewUser = createAction('[Users] Add New User', props<{ params: any }>());
export const addNewUserComplete = createAction('[Users] Add New User Complete', props<{ data: any }>());
export const updateUser = createAction('[Users] Update User', props<{ params: any }>());
export const updateUserComplete = createAction('[Users] Update User Complete', props<{ data: any }>());
export const destroyUser = createAction('[Users] Destroy User', props<{ params: any }>());
export const destroyUserComplete = createAction('[Users] Destroy User Complete', props<{ data: any }>());
export const changeStatusUser = createAction('[Users] Change Status User', props<{ params: any }>());
export const changeStatusUserComplete = createAction('[Users] Change Status User Complete', props<{ data: any }>());
export const getAllSellers = createAction('[Users] Get All sellers', props<{ params: FilterUserModel }>());
export const getAllDrivers = createAction('[Users] Get All drivers', props<{ params: FilterUserModel }>());
export const getAllSellersComplete = createAction('[Users] Get All Sellers Complete', props<{ data: any }>());
export const getAllDriversComplete = createAction('[Users] Get All Drivers Complete', props<{ data: any }>());