import {createAction, props} from '@ngrx/store';

export const getAllData = createAction('[Dashboard] Get All Data');
export const getAllDataComplete = createAction('[Dashboard] Get All Data Complete', props<{ data: any }>());
