import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as customersActions from './customers.actions';
import {CustomerService} from '../services/customer.service';
import * as generalActions from '../../common/redux/general.actions';
import {CustomerAccountService} from "../services/customer-account.service";

@Injectable()
export class CustomersEffects {

    constructor(private _actions$: Actions,
                private _customerService: CustomerService,
                private _customerAccountService: CustomerAccountService) {
    }

    getAllCustomers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.getAllCustomers),
            exhaustMap(action => {
                return this._customerService.get().pipe(
                    map(data => {
                        return customersActions.getAllCustomersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getAllCustomersBySearch$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.getAllCustomersBySearch),
            exhaustMap(action => {
                return this._customerService.getBySearch(action.params).pipe(
                    map(data => {
                        return customersActions.getAllCustomersBySearchComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllCustomers$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.filterAllCustomers),
            exhaustMap(action => {
                return this._customerService.filterAll(action.filter).pipe(
                    map(data => {
                        return customersActions.filterAllCustomersComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewCustomer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.addNewCustomer),
            // tap((action) => this.spinner.show()),
            exhaustMap(action => {
                return this._customerService.add(action.params).pipe(
                    map(data => {
                        // this.spinner.hide();
                        return customersActions.addNewCustomerComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    saveCustomer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.saveCustomer),
            map(action => {
                const data = action.params;
                return customersActions.saveCustomerComplete({data});
            })
        )
    );

    updateCustomer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.updateCustomer),
            exhaustMap(action => {
                return this._customerService.update(action.params).pipe(
                    map(data => {
                        return customersActions.updateCustomerComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    destroyCustomer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.destroyCustomer),
            exhaustMap(action => {
                return this._customerService.destroy(action.params).pipe(
                    map(data => {
                        return customersActions.destroyCustomerComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getAllCustomerAccounts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.getAllCustomerAccounts),
            exhaustMap(action => {
                return this._customerAccountService.get(action.id).pipe(
                    map(data => {
                        return customersActions.getAllCustomerAccountsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    filterAllCustomerAccounts$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.filterAllCustomerAccounts),
            exhaustMap(action => {
                return this._customerAccountService.filterAll(action.id, action.filter).pipe(
                    map(data => {
                        return customersActions.filterAllCustomerAccountsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    addNewCustomerAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.addNewCustomerAccount),
            exhaustMap(action => {
                return this._customerAccountService.add(action.id, action.params).pipe(
                    map(data => {
                        return customersActions.addNewCustomerAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    updateCustomerAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.updateCustomerAccount),
            exhaustMap(action => {
                return this._customerAccountService.update(action.params).pipe(
                    map(data => {
                        return customersActions.updateCustomerAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    changeStatusCustomerAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(customersActions.changeStatusCustomerAccount),
            exhaustMap(action => {
                return this._customerAccountService.changeStatus(action.params).pipe(
                    map(data => {
                        return customersActions.changeStatusCustomerAccountComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
