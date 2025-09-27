import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as catalogsActions from './catalogs.actions';
import * as generalActions from '../../common/redux/general.actions';
import {CatalogueService} from '../services/catalogue.service';

@Injectable()
export class CatalogsEffects {

    constructor(private _actions$: Actions,
                private _catalogueService: CatalogueService) {
    }

    getAllCatalogs$ = createEffect(() =>
        this._actions$.pipe(
            ofType(catalogsActions.getAllCatalogs),
            exhaustMap(action => {
                return this._catalogueService.get().pipe(
                    map(data => {
                        return catalogsActions.getAllCatalogsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllCatalogs$ = createEffect(() =>
        this._actions$.pipe(
            ofType(catalogsActions.filterAllCatalogs),
            exhaustMap(action => {
                return this._catalogueService.filterAll(action.filter).pipe(
                    map(data => {
                        return catalogsActions.filterAllCatalogsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewCatalogue$ = createEffect(() =>
        this._actions$.pipe(
            ofType(catalogsActions.addNewCatalogue),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._catalogueService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return catalogsActions.addNewCatalogueComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateCatalogue$ = createEffect(() =>
        this._actions$.pipe(
            ofType(catalogsActions.updateCatalogue),
            exhaustMap(action => {
                return this._catalogueService.update(action.params).pipe(
                    map(data => {
                        return catalogsActions.updateCatalogueComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyCatalogue$ = createEffect(() =>
        this._actions$.pipe(
            ofType(catalogsActions.destroyCatalogue),
            exhaustMap(action => {
                return this._catalogueService.destroy(action.params).pipe(
                    map(data => {
                        return catalogsActions.destroyCatalogueComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
