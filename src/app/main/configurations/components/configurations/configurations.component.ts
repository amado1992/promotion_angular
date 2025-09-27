import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {UserModel} from '../../../users/models/user.model';
import {AppState} from '../../../common/redux/general.reducers';

@Component({
    selector: 'app-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsComponent implements OnInit, OnDestroy {

    _activeTab = 'general';

    currentUser: UserModel;
    _pac_show = false;

    _button_show = false;
    _permissions = {
        'update': 'configuration.configurations.update'
    };

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
                private _actions$: Actions) {
    }

    ngOnInit(): void {
        this.listeningActions();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe(state => {
            if (state.auth.auth) {
                this.currentUser = state.auth.auth.user;

                if (this.currentUser.role.id != 1) {
                    this._pac_show = false;
                }

                if (this.currentUser && this.currentUser.role.name === 'Super Administrador') {
                    this._button_show = true;
                } else if (this.currentUser && this.currentUser.role.permissions) {
                    for (const permission of this.currentUser.role.permissions) {
                        if (permission.name === this._permissions.update) {
                            this._button_show = true;
                            break;
                        }
                    }
                }
            }
        }));
    }
}
