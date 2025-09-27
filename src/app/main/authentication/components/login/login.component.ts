import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';

import {Credentials} from '../../../users/models/user.model';
import {AppState} from '../../../common/redux/general.reducers';
import * as generalActions from '../../../common/redux/general.actions';
import * as authenticationActions from '../../redux/authentication.actions';
import {CoreConfigService} from '../../../../../@core/services/config.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {MenuPermission} from '../../../../menu/menu.permission';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    public error = '';
    public year: number = new Date().getFullYear();

    _coreConfig: any;
    _loginForm: FormGroup;
    _passwordTextType: boolean;
    _submitted = false;
    _loading = false;

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
                private _actions$: Actions,
                private _router: Router,
                private _coreConfigService: CoreConfigService,
                private _coreMenuService: CoreMenuService,
                private _menuPermission: MenuPermission) {
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onLogin() {
        this._submitted = true;
        if (this._loginForm.invalid) {
            return;
        }
        this._loading = true;

        const credentials: Credentials = {
            email: this._loginForm.get('email').value,
            password: this._loginForm.get('password').value
        };
        this._store.dispatch(generalActions.showLoading({showLoading: true}));
        this._store.dispatch(authenticationActions.login({credentials: credentials}));
    }

    get controls() {
        return this._loginForm.controls;
    }

    listeningActions(): void {
        this._subscription.add(this._coreConfigService.config.subscribe(config => {
            this._coreConfig = config;
        }));

        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth && state.auth.auth.user) {
                this._coreMenuService.unregister('main');
                this._coreMenuService.register('main', this._menuPermission.getMenu());
            }
        }));

        this._subscription.add(
            this._actions$.pipe(
                ofType(authenticationActions.getUserLoggedComplete)
            ).subscribe(response => {
                this._store.dispatch(generalActions.hideLoading({showLoading: false}));
                this._router.navigate(['/dashboard']).then();
            })
        );

        this._subscription.add(
            this._actions$.pipe(
                ofType(generalActions.hideLoading)
            ).subscribe(response => {
                this._loading = response.showLoading;
            })
        );
    }

    initializeForm() {
        this._loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }

    togglePasswordTextType() {
        this._passwordTextType = !this._passwordTextType;
    }
}
