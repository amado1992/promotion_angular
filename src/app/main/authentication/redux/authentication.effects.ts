import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as authenticationActions from './authentication.actions';
import * as generalActions from '../../common/redux/general.actions';
import {SessionService} from '../../common/services/session.service';
import {AuthenticationService} from '../services/authentication.service';
import {BranchOfficeService} from '../../branch-offices/services/branch-office.service';
import {RoleService} from '../../roles/services/role.service';

@Injectable()
export class AuthenticationEffects {

    constructor(private _actions$: Actions,
                // private _spinner: ,
                private _authenticationService: AuthenticationService,
                private _sessionService: SessionService,
                private _roleService: RoleService,
                private _branchOfficeService: BranchOfficeService) {
    }

    login$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.login),
            // tap((action) => this.spinner.show()),
            exhaustMap(action =>
                this._authenticationService.login(action.credentials).pipe(
                    map(data => authenticationActions.loginComplete({data})),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            )
        )
    );

    loginComplete$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.loginComplete),
            exhaustMap(action =>
                this._authenticationService.getUserData().pipe(
                    map(data => {
                        // this.spinner.hide();
                        return authenticationActions.getUserLoggedComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            )
        )
    );

    getUserLogged$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.getUserLogged),
            exhaustMap(action =>
                this._authenticationService.getUserData().pipe(
                    map(data => {
                        return authenticationActions.getUserLoggedComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            )
        )
    );

    refreshToken$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.refreshToken),
            exhaustMap(action =>
                this._sessionService.refreshToken().pipe(
                    map(data => authenticationActions.refreshTokenComplete(data)),
                    catchError(error => {
                        return of(authenticationActions.refreshTokenError({error}));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.logout),
            // tap((action) => this.spinner.show()),
            exhaustMap(action =>
                this._authenticationService.logout().pipe(
                    map(data => {
                        // this.spinner.hide();
                        return authenticationActions.logoutComplete();
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            )
        )
    );

    changePasswordUserLogged$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.changePasswordUserLogged),
            exhaustMap(action => {
                return this._authenticationService.changePassword(action.params).pipe(
                    map(data => {
                        return authenticationActions.changePasswordUserLoggedComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    changeAccountUserLogged$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.changeAccountUserLogged),
            exhaustMap(action => {
                return this._authenticationService.changeAccount(action.params).pipe(
                    map(data => {
                        return authenticationActions.changeAccountUserLoggedComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updateRolesInAuthState$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.updateRolesInAuthState),
            exhaustMap(actions =>
                this._roleService.get().pipe(
                    map(data => authenticationActions.updateRolesInAuthStateComplete(data)),
                    catchError(error => {
                        return of(authenticationActions.refreshTokenError({error}));
                    })
                )
            )
        )
    );

    updateBranchOfficesInAuthState$ = createEffect(() =>
        this._actions$.pipe(
            ofType(authenticationActions.updateBranchOfficesInAuthState),
            exhaustMap(actions =>
                this._branchOfficeService.get().pipe(
                    map(data => authenticationActions.updateBranchOfficesInAuthStateComplete(data)),
                    catchError(error => {
                        return of(authenticationActions.refreshTokenError({error}));
                    })
                )
            )
        )
    );
}
