import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as branchOfficesActions from './branch-offices.actions';
import * as generalActions from '../../common/redux/general.actions';
import {BranchOfficeService} from '../services/branch-office.service';

@Injectable()
export class BranchOfficesEffects {

    constructor(private _actions$: Actions,
                private _branchOfficeService: BranchOfficeService) {
    }

    getAllBranchOffices$ = createEffect(() =>
        this._actions$.pipe(
            ofType(branchOfficesActions.getAllBranchOffices),
            exhaustMap(action => {
                return this._branchOfficeService.get().pipe(
                    map(data => {
                        return branchOfficesActions.getAllBranchOfficesComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllBranchOffices$ = createEffect(() =>
        this._actions$.pipe(
            ofType(branchOfficesActions.filterAllBranchOffices),
            exhaustMap(action => {
                return this._branchOfficeService.filterAll(action.filter).pipe(
                    map(data => {
                        return branchOfficesActions.filterAllBranchOfficesComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewBranchOffice$ = createEffect(() =>
        this._actions$.pipe(
            ofType(branchOfficesActions.addNewBranchOffice),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._branchOfficeService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return branchOfficesActions.addNewBranchOfficeComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateBranchOffice$ = createEffect(() =>
        this._actions$.pipe(
            ofType(branchOfficesActions.updateBranchOffice),
            exhaustMap(action => {
                return this._branchOfficeService.update(action.params).pipe(
                    map(data => {
                        return branchOfficesActions.updateBranchOfficeComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyBranchOffice$ = createEffect(() =>
        this._actions$.pipe(
            ofType(branchOfficesActions.destroyBranchOffice),
            exhaustMap(action => {
                return this._branchOfficeService.destroy(action.params).pipe(
                    map(data => {
                        return branchOfficesActions.destroyBranchOfficeComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
