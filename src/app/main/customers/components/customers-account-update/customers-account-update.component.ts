import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

import {CustomerModel} from "../../models/customer.model";
import {AppState} from "../../../common/redux/general.reducers";
import * as customersActions from "../../redux/customers.actions";
import {CustomerAccountModel} from "../../models/customer-account.model";

@Component({
    selector: 'app-customers-account-update',
    templateUrl: './customers-account-update.component.html',
    styleUrls: ['./customers-account-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomersAccountUpdateComponent implements OnInit, OnDestroy {

    @Input() customer: CustomerModel;
    @Input() customerAccount: CustomerAccountModel;

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
            'id': this.customer.id,
            'account_id': this._updateAccountForm.get('account_id').value,
            'bank_name': this._updateAccountForm.get('bank_name').value,
            'bank_rfc': this._updateAccountForm.get('bank_rfc').value,
            'number_account': this._updateAccountForm.get('number_account').value
        };

        this._store.dispatch(customersActions.updateCustomerAccount({params: account}));
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
                .pipe(ofType(customersActions.updateCustomerAccountComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._updateAccountForm = new FormGroup({
            'account_id': new FormControl(this.customerAccount.id, Validators.required),
            'bank_name': new FormControl(this.customerAccount.bank_name, Validators.required),
            'bank_rfc': new FormControl(this.customerAccount.bank_rfc, Validators.required),
            'number_account': new FormControl(this.customerAccount.number_account, Validators.required)
        });
    }
}
