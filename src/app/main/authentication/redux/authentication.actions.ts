import {createAction, props} from '@ngrx/store';

import {Credentials, Tokens} from '../../users/models/user.model';

export const login = createAction('[Authentication] Login', props<{ credentials: Credentials }>());
export const loginComplete = createAction('[Authentication] Login Complete', props<{ data: any }>());
export const getUserLogged = createAction('[Authentication] Get User Logged');
export const getUserLoggedComplete = createAction('[Authentication] Get User Logged Complete', props<{ data: any }>());
export const refreshToken = createAction('[Authentication] Refresh Token');
export const refreshTokenComplete = createAction('[Authentication] Refresh Token Complete', props<Tokens>());
export const refreshTokenError = createAction('[Authentication] Refresh Token Error', props<{ error: any }>());
export const logout = createAction('[Authentication] Logout');
export const logoutComplete = createAction('[Authentication] Logout Complete');

export const changePasswordUserLogged = createAction('[Authentication] Change Password User Logged', props<{ params: any }>());
export const changePasswordUserLoggedComplete = createAction('[Authentication] Change Password User Logged Complete', props<{ data: any }>());
export const changeAccountUserLogged = createAction('[Authentication] Change Account User Logged', props<{ params: any }>());
export const changeAccountUserLoggedComplete = createAction('[Authentication] Change Account User Logged Complete', props<{ data: any }>());

export const updateRolesInAuthState = createAction('[Authentication] Update Roles in Auth State');
export const updateRolesInAuthStateComplete = createAction('[Authentication] Update Roles in Auth State Complete', props<{ data: any }>());

export const updateBranchOfficesInAuthState = createAction('[Authentication] Update BranchOffices in Auth State');
export const updateBranchOfficesInAuthStateComplete = createAction('[Authentication] Update BranchOffices in Auth State Complete', props<{ data: any }>());
