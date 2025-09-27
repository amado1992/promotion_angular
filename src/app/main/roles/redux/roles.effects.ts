import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as usersActions from './roles.actions';
import * as generalActions from '../../common/redux/general.actions';
import {RoleService} from '../services/role.service';

@Injectable()
export class RolesEffects {

    constructor(private _actions$: Actions,
                private _roleService: RoleService) {
    }

    filterAllRoles$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.filterAllRoles),
            exhaustMap(action => {
                return this._roleService.filterAll(action.filter).pipe(
                    map(data => {
                        return usersActions.filterAllRolesComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewRole$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.addNewRole),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._roleService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return usersActions.addNewRoleComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateRole$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.updateRole),
            exhaustMap(action => {
                return this._roleService.update(action.params).pipe(
                    map(data => {
                        return usersActions.updateRoleComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyRole$ = createEffect(() =>
        this._actions$.pipe(
            ofType(usersActions.destroyRole),
            exhaustMap(action => {
                return this._roleService.destroy(action.params).pipe(
                    map(data => {
                        return usersActions.destroyRoleComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
