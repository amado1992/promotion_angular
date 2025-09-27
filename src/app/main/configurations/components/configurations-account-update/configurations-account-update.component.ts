import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

import {AppState} from "../../../common/redux/general.reducers";
import {AccountConfigurationModel} from "../../models/configuration.model";
import * as configurationsActions from "../../redux/configurations.actions";

@Component({
    selector: 'app-configurations-account-update',
    templateUrl: './configurations-account-update.component.html',
    styleUrls: ['./configurations-account-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsAccountUpdateComponent implements OnInit, OnDestroy {

    @Input() accountConfiguration: AccountConfigurationModel;
    _updateAccountForm: FormGroup;
    _submitted = false;

    private _subscription = new Subscription();

    constructor(public _activeModal: NgbActiveModal,
                private _store: Store<AppState>,
                private _actions$: Actions) {
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

    onUpdate(): void {
        this._submitted = true;
        if (this._updateAccountForm.invalid) {
            return;
        }
        const accountUpdate = {
            'id': this._updateAccountForm.get('id').value,
            'bank_name': this._updateAccountForm.get('bank_name').value,
            'bank_rfc': this._updateAccountForm.get('bank_rfc').value,
            'number_account': this._updateAccountForm.get('number_account').value
        };

        this._store.dispatch(configurationsActions.updateAccountConfiguration({params: accountUpdate}));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._updateAccountForm.controls;
    }

    listeningActions(): void {
        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.updateAccountConfigurationComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._updateAccountForm = new FormGroup({
            'id': new FormControl(this.accountConfiguration.id, Validators.required),
            'bank_name': new FormControl(this.accountConfiguration.bank_name, Validators.required),
            'bank_rfc': new FormControl(this.accountConfiguration.bank_rfc, Validators.required),
            'number_account': new FormControl(this.accountConfiguration.number_account, Validators.required)
        });
    }
}
