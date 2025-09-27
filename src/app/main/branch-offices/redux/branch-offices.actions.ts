import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const getAllBranchOffices = createAction('[BranchOffices] Get All BranchOffices');
export const getAllBranchOfficesComplete = createAction('[BranchOffices] Get All BranchOffices Complete', props<{ data: any }>());
export const filterAllBranchOffices = createAction('[BranchOffices] Filter All BranchOffices', props<{ filter: FilterModel }>());
export const filterAllBranchOfficesComplete = createAction('[BranchOffices] Filter All BranchOffices Complete', props<{ data: any }>());
export const addNewBranchOffice = createAction('[BranchOffices] Add New BranchOffice', props<{ params: any }>());
export const addNewBranchOfficeComplete = createAction('[BranchOffices] Add New BranchOffice Complete', props<{ data: any }>());
export const updateBranchOffice = createAction('[BranchOffices] Update BranchOffice', props<{ params: any }>());
export const updateBranchOfficeComplete = createAction('[BranchOffices] Update BranchOffice Complete', props<{ data: any }>());
export const destroyBranchOffice = createAction('[BranchOffices] Destroy BranchOffice', props<{ params: any }>());
export const destroyBranchOfficeComplete = createAction('[BranchOffices] Destroy BranchOffice Complete', props<{ data: any }>());
