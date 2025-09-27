import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {CustomerModel} from "../../models/customer.model";
import {AppState} from "../../../common/redux/general.reducers";
import * as customersActions from "../../redux/customers.actions";

@Component({
    selector: 'app-customers-account-new',
    templateUrl: './customers-account-new.component.html',
    styleUrls: ['./customers-account-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomersAccountNewComponent implements OnInit, OnDestroy {

    @Input() customer: CustomerModel;

    _addNewAccountForm: FormGroup;
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

    onCreate(): void {
        this._submitted = true;
        if (this._addNewAccountForm.invalid) {
            return;
        }

        const account = {
            'bank_name': this._addNewAccountForm.get('bank_name').value,
            'bank_rfc': this._addNewAccountForm.get('bank_rfc').value,
            'number_account': this._addNewAccountForm.get('number_account').value
        };

        this._store.dispatch(customersActions.addNewCustomerAccount({id: this.customer.id, params: account}));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._addNewAccountForm.controls;
    }

    listeningActions(): void {
        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.addNewCustomerAccountComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._addNewAccountForm = new FormGroup({
            'bank_name': new FormControl('', Validators.required),
            'bank_rfc': new FormControl('', Validators.required),
            'number_account': new FormControl('', Validators.required)
        });
    }
}
