import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {of} from 'rxjs';

import * as configurationsActions from './configurations.actions';
import * as generalActions from '../../common/redux/general.actions';
import {ConfigurationService} from '../services/configuration.service';
import {PacConfigurationService} from '../services/pac-configuration.service';
import {FolioConfigurationService} from '../services/folio-configuration.service';
import {AccountConfigurationService} from "../services/account-configuration.service";
import {BillingConfigurationService} from '../services/billing-configuration.service';
import {NotificationConfigurationService} from '../services/notification-configuration.service';

@Injectable()
export class ConfigurationsEffects {

    constructor(private _actions$: Actions,
                private _configurationService: ConfigurationService,
                private _accountConfigurationService: AccountConfigurationService,
                private _folioConfigurationService: FolioConfigurationService,
                private _billingConfigurationService: BillingConfigurationService,
                private _notificationConfigurationService: NotificationConfigurationService,
                private _pacConfigurationService: PacConfigurationService) {
    }

    getConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.getConfiguration),
            exhaustMap(action => {
                return this._configurationService.get().pipe(
                    map(data => {
                        return configurationsActions.getConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updateConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updateConfiguration),
            exhaustMap(action => {
                return this._configurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updateConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    getAllAccountConfigurations$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.getAllAccountConfigurations),
            exhaustMap(action => {
                return this._accountConfigurationService.get().pipe(
                    map(data => {
                        return configurationsActions.getAllAccountConfigurationsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    filterAllAccountConfigurations$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.filterAllAccountConfigurations),
            exhaustMap(action => {
                return this._accountConfigurationService.filterAll(action.filter).pipe(
                    map(data => {
                        return configurationsActions.filterAllAccountConfigurationsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    addNewAccountConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.addNewAccountConfiguration),
            exhaustMap(action => {
                return this._accountConfigurationService.add(action.params).pipe(
                    map(data => {
                        return configurationsActions.addNewAccountConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    updateAccountConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updateAccountConfiguration),
            exhaustMap(action => {
                return this._accountConfigurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updateAccountConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    destroyAccountConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.destroyAccountConfiguration),
            exhaustMap(action => {
                return this._accountConfigurationService.destroy(action.params).pipe(
                    map(data => {
                        return configurationsActions.destroyAccountConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    changeStatusAccountConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.changeStatusAccountConfiguration),
            exhaustMap(action => {
                return this._accountConfigurationService.changeStatus(action.params).pipe(
                    map(data => {
                        return configurationsActions.changeStatusAccountConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                )
            })
        )
    );

    getFolioConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.getFolioConfiguration),
            exhaustMap(action => {
                return this._folioConfigurationService.get().pipe(
                    map(data => {
                        return configurationsActions.getFolioConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updateFolioConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updateFolioConfiguration),
            exhaustMap(action => {
                return this._folioConfigurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updateFolioConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updateBillingConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updateBillingConfiguration),
            exhaustMap(action => {
                return this._billingConfigurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updateBillingConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                )
            })
        )
    );

    getNotificationConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.getNotificationConfiguration),
            exhaustMap(action => {
                return this._notificationConfigurationService.get().pipe(
                    map(data => {
                        return configurationsActions.getNotificationConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updateNotificationConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updateNotificationConfiguration),
            exhaustMap(action => {
                return this._notificationConfigurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updateNotificationConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    getPacConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.getPacConfiguration),
            exhaustMap(action => {
                return this._pacConfigurationService.get().pipe(
                    map(data => {
                        return configurationsActions.getPacConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );

    updatePacConfiguration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(configurationsActions.updatePacConfiguration),
            exhaustMap(action => {
                return this._pacConfigurationService.update(action.params).pipe(
                    map(data => {
                        return configurationsActions.updatePacConfigurationComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state(error)))
                );
            })
        )
    );
}
