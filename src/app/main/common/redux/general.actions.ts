import {createAction, props} from '@ngrx/store';

export const showLoading = createAction('[General] Show Loading', props<{ showLoading: boolean }>());
export const hideLoading = createAction('[General] Hide Loading', props<{ showLoading: boolean }>());

export const fileUpload = createAction('[General] Files Upload', props<{ params: any }>());
export const fileUploadComplete = createAction('[General] Files Upload Complete', props<{ data: any }>());
export const getUbications = createAction('[General] Get All Ubications', props<{ params: any }>());
export const getUbicationsComplete = createAction('[General] Get All Ubications Complete', props<{ data: any }>());

export const finish_state = createAction('[General] Finish State', props<{ error: any }>());

export const fileUploadMultiple = createAction('[General] Files Upload Multiple', props<{ params: any }>());
export const fileUploadMultipleComplete = createAction('[General] Files Upload Multiple Complete', props<{ data: any }>());
