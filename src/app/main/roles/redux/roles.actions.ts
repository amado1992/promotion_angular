import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const filterAllRoles = createAction('[Users] Filter All Roles', props<{ filter: FilterModel }>());
export const filterAllRolesComplete = createAction('[Users] Filter All Roles Complete', props<{ data: any }>());
export const addNewRole = createAction('[Users] Add New Role', props<{ params: any }>());
export const addNewRoleComplete = createAction('[Users] Add New Role Complete', props<{ data: any }>());
export const updateRole = createAction('[Users] Update Role', props<{ params: any }>());
export const updateRoleComplete = createAction('[Users] Update Role Complete', props<{ data: any }>());
export const destroyRole = createAction('[Users] Destroy Role', props<{ params: any }>());
export const destroyRoleComplete = createAction('[Users] Destroy Role Complete', props<{ data: any }>());
