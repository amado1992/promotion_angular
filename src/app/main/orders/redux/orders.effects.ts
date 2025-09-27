import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

import * as ordersActions from './orders.actions';
import { OrdersService } from '../services/orders.service';
import * as generalActions from '../../common/redux/general.actions';

@Injectable()
export class OrdersEffects {

    constructor(private _actions$: Actions,
        private _ordersService: OrdersService,
        private _spinner: NgxSpinnerService) {
    }

    filterAllOrders$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.filterAllOrders),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._ordersService.filterAllOrders(action.filter).pipe(
                    map(data => {
                        this._spinner.hide();
                        return ordersActions.filterAllOrdersComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    addNewOrder$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.addNewOrder),
            exhaustMap(action => {
                return this._ordersService.addOrder(action.params).pipe(
                    map(data => {
                        return ordersActions.addNewOrderComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    saveOrder$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.saveOrder),
            map(action => {
                const data = action.params;
                return ordersActions.saveOrderComplete({ data });
            })
        )
    );

    updateOrder$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.updateOrder),
            exhaustMap(action => {
                return this._ordersService.updateOrder(action.params).pipe(
                    map(data => {
                        return ordersActions.updateOrderComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    destroyOrder$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.destroyOrder),
            exhaustMap(action => {
                return this._ordersService.destroyOrder(action.params).pipe(
                    map(data => {
                        return ordersActions.destroyOrderComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getOrdersExportExcel$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.getOrdersExportExcel),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._ordersService.exportExcelOrder(action.filters).pipe(
                    map(data => {
                        this._spinner.hide();
                        return ordersActions.getOrdersExportExcelComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getTopBranchOffice$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.getTopBranchOffices),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._ordersService.getTopBranchOffices().pipe(
                    map(data => {
                        this._spinner.hide();
                        return ordersActions.getTopBranchOfficesComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getTopProducts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.getTopProducts),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._ordersService.getTopProducts().pipe(
                    map(data => {
                        this._spinner.hide();
                        return ordersActions.getTopProductsComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getTotals$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.getTotals),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._ordersService.getTotals().pipe(
                    map(data => {
                        this._spinner.hide();
                        return ordersActions.getTotalsComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getOrderPdf$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ordersActions.getOrderPdf),
            exhaustMap(action => {
                return this._ordersService.getOrderPdf(action.params).pipe(
                    map(data => {
                        return ordersActions.getOrderPdfComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );
}
