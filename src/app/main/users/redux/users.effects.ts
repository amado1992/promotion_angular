import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as usersActions from './users.actions';
import * as generalActions from '../../common/redux/general.actions';
import {UserService} from '../services/user.service';

@Injectable()
export class UsersEffects {

    constructor(private _actions$: Actions,
                private _userService: UserService) {
    }

    getAllUsers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.getAllUsers),
            exhaustMap(action => {
                return this._userService.get().pipe(
                    map(data => {
                        return usersActions.getAllUsersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllUsers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.filterAllUsers),
            exhaustMap(action => {
                return this._userService.filterAll(action.filter).pipe(
                    map(data => {
                        return usersActions.filterAllUsersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.addNewUser),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._userService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return usersActions.addNewUserComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.updateUser),
            exhaustMap(action => {
                return this._userService.update(action.params).pipe(
                    map(data => {
                        return usersActions.updateUserComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.destroyUser),
            exhaustMap(action => {
                return this._userService.destroy(action.params).pipe(
                    map(data => {
                        return usersActions.destroyUserComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    changeStatusUser$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.changeStatusUser),
            exhaustMap(action => {
                return this._userService.changeStatus(action.params).pipe(
                    map(data => {
                        return usersActions.changeStatusUserComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    getAllSellers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.getAllSellers),
            exhaustMap(action => {
                return this._userService.getUsersByRole(action.params).pipe(
                    map(data => {
                        return usersActions.getAllSellersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getAllDrivers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.getAllDrivers),
            exhaustMap(action => {
                return this._userService.getUsersByRole(action.params).pipe(
                    map(data => {
                        return usersActions.getAllDriversComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

}
