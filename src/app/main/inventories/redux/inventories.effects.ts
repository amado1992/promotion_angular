import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

import * as inventoriesActions from './inventories.actions';
import { InventoriesService } from '../services/inventories.service';
import * as generalActions from '../../common/redux/general.actions';

@Injectable()
export class InventoriesEffects {

    constructor(private _actions$: Actions,
        private _inventoriesService: InventoriesService,
        private _spinner: NgxSpinnerService) {
    }

    filterAllInventories$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.filterAllInventories),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._inventoriesService.filterAllInventories(action.filter).pipe(
                    map(data => {
                        this._spinner.hide();
                        return inventoriesActions.filterAllInventoriesComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    addNewInventory$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.addNewInventory),
            exhaustMap(action => {
                return this._inventoriesService.addInventory(action.params).pipe(
                    map(data => {
                        return inventoriesActions.addNewInventoryComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    saveInventory$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.saveInventory),
            map(action => {
                const data = action.params;
                return inventoriesActions.saveInventoryComplete({ data });
            })
        )
    );

    updateInventory$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.updateInventory),
            exhaustMap(action => {
                return this._inventoriesService.updateInventory(action.params).pipe(
                    map(data => {
                        return inventoriesActions.updateInventoryComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    destroyInventory$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.destroyInventory),
            exhaustMap(action => {
                return this._inventoriesService.destroyInventory(action.params).pipe(
                    map(data => {
                        return inventoriesActions.destroyInventoryComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getInventoriesExportExcel$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.getInventoriesExportExcel),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._inventoriesService.exportExcelInventory(action.filters).pipe(
                    map(data => {
                        this._spinner.hide();
                        return inventoriesActions.getInventoriesExportExcelComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    adjustmentInventoryMovements$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.adjustmentInventoryMovements),
            exhaustMap(action => {
                return this._inventoriesService.adjustmentMovementsByInventoryId(action.inventory_id, action.params).pipe(
                    map(data => {
                        return inventoriesActions.adjustmentInventoryMovementsComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    filterAllInventoryMovements$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.filterAllInventoryMovements),
            exhaustMap(action => {
                return this._inventoriesService.filterAllMovementsByInventoryId(action.inventory_id, action.filter).pipe(
                    map(data => {
                        return inventoriesActions.filterAllInventoryMovementsComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    getInventoryPdf$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.getInventoryPdf),
            exhaustMap(action => {
                return this._inventoriesService.getIntoryMovements(action.inventory_id, action.filter).pipe(
                    map(data => {
                        return inventoriesActions.getInventoryPdfComplete({ data });
                    }),
                    catchError(error => of(generalActions.finish_state({ error })))
                );
            })
        )
    );

    updateMovement$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.updateMovement),
            exhaustMap(action => {
                return this._inventoriesService.updateMovement(action.params).pipe(
                    map(data => {
                        return inventoriesActions.updateMovementComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyMovement$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.destroyMovement),
            exhaustMap(action => {
                return this._inventoriesService.destroyMovement(action.params).pipe(
                    map(data => {
                        return inventoriesActions.destroyMovementComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    saveInventoriesFilters$ = createEffect(() =>
        this._actions$.pipe(
            ofType(inventoriesActions.saveInventoriesFilters),
            map(action => {
                const data = action.params;
                return inventoriesActions.saveInventoriesFiltersComplete({ data });
            })
        )
    );
}
