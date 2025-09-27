import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as productsActions from './products.actions';
import * as generalActions from '../../common/redux/general.actions';
import {ProductService} from '../services/product.service';

@Injectable()
export class ProductsEffects {

    constructor(private _actions$: Actions,
                private _productService: ProductService) {
    }

    getAllProducts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(productsActions.getAllProducts),
            exhaustMap(action => {
                return this._productService.get().pipe(
                    map(data => {
                        return productsActions.getAllProductsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllProducts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(productsActions.filterAllProducts),
            exhaustMap(action => {
                return this._productService.filterAll(action.filter).pipe(
                    map(data => {
                        return productsActions.filterAllProductsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewProduct$ = createEffect(() =>
        this._actions$.pipe(
            ofType(productsActions.addNewProduct),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._productService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return productsActions.addNewProductComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateProduct$ = createEffect(() =>
        this._actions$.pipe(
            ofType(productsActions.updateProduct),
            exhaustMap(action => {
                return this._productService.update(action.params).pipe(
                    map(data => {
                        return productsActions.updateProductComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyProduct$ = createEffect(() =>
        this._actions$.pipe(
            ofType(productsActions.destroyProduct),
            exhaustMap(action => {
                return this._productService.destroy(action.params).pipe(
                    map(data => {
                        return productsActions.destroyProductComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getAllProductsBySearch$ = createEffect(() =>
            this._actions$.pipe(
                ofType(productsActions.getAllProductsBySearch),
                exhaustMap(action => {
                    return this._productService.getBySearch(action.params).pipe(
                        map(data => {
                            return productsActions.getAllProductsBySearchComplete({data});
                        }),
                        catchError(error => of(generalActions.finish_state({error})))
                    );
                })
            )
        );

        getProductsBySearch$ = createEffect(() =>
            this._actions$.pipe(
                ofType(productsActions.getProductsBySearch),
                exhaustMap(action => {
                    return this._productService.getProductsBySearch(action.params).pipe(
                        map(data => {
                            return productsActions.getProductsBySearchComplete({data});
                        }),
                        catchError(error => of(generalActions.finish_state({error})))
                    );
                })
            )
        );
}
