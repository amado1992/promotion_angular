import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as providersActions from './providers.actions';
import {ProviderService} from '../services/provider.service';
import * as generalActions from '../../common/redux/general.actions';
import {ProviderAccountService} from "../services/provider-account.service";

@Injectable()
export class ProvidersEffects {

    constructor(private _actions$: Actions,
                private _providerService: ProviderService,
                private _providerAccountService: ProviderAccountService) {
    }

    getAllProviders$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.getAllProviders),
            exhaustMap(action => {
                return this._providerService.get().pipe(
                    map(data => {
                        return providersActions.getAllProvidersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllProviders$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.filterAllProviders),
            exhaustMap(action => {
                return this._providerService.filterAll(action.filter).pipe(
                    map(data => {
                        return providersActions.filterAllProvidersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewProvider$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.addNewProvider),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._providerService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return providersActions.addNewProviderComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    saveProvider$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.saveProvider),
            map(action => {
                const data = action.params;
                return providersActions.saveProviderComplete({data});
            })
        )
    );

    updateProvider$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.updateProvider),
            exhaustMap(action => {
                return this._providerService.update(action.params).pipe(
                    map(data => {
                        return providersActions.updateProviderComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyProvider$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.destroyProvider),
            exhaustMap(action => {
                return this._providerService.destroy(action.params).pipe(
                    map(data => {
                        return providersActions.destroyProviderComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getAllProviderAccounts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.getAllProviderAccounts),
            exhaustMap(action => {
                return this._providerAccountService.get(action.id).pipe(
                    map(data => {
                        return providersActions.getAllProviderAccountsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllProviderAccounts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.filterAllProviderAccounts),
            exhaustMap(action => {
                return this._providerAccountService.filterAll(action.id, action.filter).pipe(
                    map(data => {
                        return providersActions.filterAllProviderAccountsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewProviderAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.addNewProviderAccount),
            exhaustMap(action => {
                return this._providerAccountService.add(action.id, action.params).pipe(
                    map(data => {
                        return providersActions.addNewProviderAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateProviderAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.updateProviderAccount),
            exhaustMap(action => {
                return this._providerAccountService.update(action.params).pipe(
                    map(data => {
                        return providersActions.updateProviderAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyProviderAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.destroyProviderAccount),
            exhaustMap(action => {
                return this._providerAccountService.destroy(action.params).pipe(
                    map(data => {
                        return providersActions.destroyProviderAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    changeStatusProviderAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(providersActions.changeStatusProviderAccount),
            exhaustMap(action => {
                return this._providerAccountService.changeStatus(action.params).pipe(
                    map(data => {
                        return providersActions.changeStatusProviderAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
