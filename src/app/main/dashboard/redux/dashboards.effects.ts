import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as dashboardsActions from './dashboards.actions';
import * as generalActions from '../../common/redux/general.actions';
import {DashboardService} from '../services/dashboard.service';

@Injectable()
export class DashboardsEffects {

    constructor(private _actions$: Actions,
                private _dashboardService: DashboardService) {
    }

    getAllData$ = createEffect(() =>
        this._actions$.pipe(
            ofType(dashboardsActions.getAllData),
            exhaustMap(action => {
                return this._dashboardService.getAllData().pipe(
                    map(data => {
                        return dashboardsActions.getAllDataComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
