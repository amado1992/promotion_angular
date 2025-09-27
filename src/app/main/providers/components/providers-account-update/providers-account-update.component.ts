import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ProviderModel} from "../../models/provider.model";
import {ProviderAccountModel} from "../../models/provider-account.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../common/redux/general.reducers";
import {Actions, ofType} from "@ngrx/effects";
import * as providersActions from "../../redux/providers.actions";

@Component({
    selector: 'app-providers-account-update',
    templateUrl: './providers-account-update.component.html',
    styleUrls: ['./providers-account-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProvidersAccountUpdateComponent implements OnInit, OnDestroy {

    @Input() provider: ProviderModel;
    @Input() providerAccount: ProviderAccountModel;

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

        const account = {
            'id': this.provider.id,
            'account_id': this._updateAccountForm.get('account_id').value,
            'bank_name': this._updateAccountForm.get('bank_name').value,
            'bank_rfc': this._updateAccountForm.get('bank_rfc').value,
            'number_account': this._updateAccountForm.get('number_account').value
        };

        this._store.dispatch(providersActions.updateProviderAccount({params: account}));
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
                .pipe(ofType(providersActions.updateProviderAccountComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._updateAccountForm = new FormGroup({
            'account_id': new FormControl(this.providerAccount.id, Validators.required),
            'bank_name': new FormControl(this.providerAccount.bank_name, Validators.required),
            'bank_rfc': new FormControl(this.providerAccount.bank_rfc, Validators.required),
            'number_account': new FormControl(this.providerAccount.number_account, Validators.required)
        });
    }
}
