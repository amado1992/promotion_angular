import {createAction, props} from '@ngrx/store';
import {FilterModel} from "../../common/models/filter.model";

export const getConfiguration = createAction('[Configuration] Get Configuration');
export const getConfigurationComplete = createAction('[Configuration] Get Configuration Complete', props<{ data: any }>());
export const updateConfiguration = createAction('[Configuration] Update Configuration', props<{ params: any }>());
export const updateConfigurationComplete = createAction('[Configuration] Update Configuration Complete', props<{ data: any }>());

export const getAllAccountConfigurations = createAction('[Configuration] Get All Account Configurations');
export const getAllAccountConfigurationsComplete = createAction('[Configuration] Get All Account Configurations Complete', props<{ data: any }>());
export const filterAllAccountConfigurations = createAction('[Configuration] Filter All Account Configurations', props<{ filter: FilterModel }>());
export const filterAllAccountConfigurationsComplete = createAction('[Configuration] Filter All Account Configurations Complete', props<{ data: any }>());
export const addNewAccountConfiguration = createAction('[Configuration] Add New Account Configuration', props<{ params: any }>());
export const addNewAccountConfigurationComplete = createAction('[Configuration] Add New Account Configuration Complete', props<{ data: any }>());
export const updateAccountConfiguration = createAction('[Configuration] Update Account Configuration', props<{ params: any }>());
export const updateAccountConfigurationComplete = createAction('[Configuration] Update Account Configuration Complete', props<{ data: any }>());
export const destroyAccountConfiguration = createAction('[Configuration] Destroy Account Configuration', props<{ params: any }>());
export const destroyAccountConfigurationComplete = createAction('[Configuration] Destroy Account Configuration Complete', props<{ data: any }>());
export const changeStatusAccountConfiguration = createAction('[Configuration] Change Status Account Configuration', props<{ params: any }>());
export const changeStatusAccountConfigurationComplete = createAction('[Configuration] Change Status Account Configuration Complete', props<{ data: any }>());

export const getFolioConfiguration = createAction('[Configuration] Get Folio Configuration');
export const getFolioConfigurationComplete = createAction('[Configuration] Get Folio Configuration Complete', props<{ data: any }>());
export const updateFolioConfiguration = createAction('[Configuration] Update Folio Configuration', props<{ params: any }>());
export const updateFolioConfigurationComplete = createAction('[Configuration] Update Folio Configuration Complete', props<{ data: any }>());
export const updateBillingConfiguration = createAction('[Configuration] Update Billing Configuration', props<{ params: any }>());
export const updateBillingConfigurationComplete = createAction('[Configuration] Update Billing Configuration Complete', props<{ data: any }>());

export const getNotificationConfiguration = createAction('[Configuration] Get Notification Configuration');
export const getNotificationConfigurationComplete = createAction('[Configuration] Get Notification Configuration Complete', props<{ data: any }>());
export const updateNotificationConfiguration = createAction('[Configuration] Update Notification Configuration', props<{ params: any }>());
export const updateNotificationConfigurationComplete = createAction('[Configuration] Update Notification Configuration Complete', props<{ data: any }>());

export const getPacConfiguration = createAction('[Configuration] Get Pac Configuration');
export const getPacConfigurationComplete = createAction('[Configuration] Get Pac Configuration Complete', props<{ data: any }>());
export const updatePacConfiguration = createAction('[Configuration] Update Pac Configuration', props<{ params: any }>());
export const updatePacConfigurationComplete = createAction('[Configuration] Update Pac Configuration Complete', props<{ data: any }>());
