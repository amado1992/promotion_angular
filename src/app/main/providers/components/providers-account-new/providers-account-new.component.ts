import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

import {ProviderModel} from "../../models/provider.model";
import {AppState} from "../../../common/redux/general.reducers";
import * as providersActions from "../../redux/providers.actions"

@Component({
    selector: 'app-providers-account-new',
    templateUrl: './providers-account-new.component.html',
    styleUrls: ['./providers-account-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProvidersAccountNewComponent implements OnInit, OnDestroy {

    @Input() provider: ProviderModel;

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

        this._store.dispatch(providersActions.addNewProviderAccount({id: this.provider.id, params: account}));
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
                .pipe(ofType(providersActions.addNewProviderAccountComplete))
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
