import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {AppState} from "../../../common/redux/general.reducers";
import * as configurationsActions from "../../redux/configurations.actions";

@Component({
    selector: 'app-configurations-account-new',
    templateUrl: './configurations-account-new.component.html',
    styleUrls: ['./configurations-account-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsAccountNewComponent implements OnInit, OnDestroy {

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

        this._store.dispatch(configurationsActions.addNewAccountConfiguration({params: account}));
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
                .pipe(ofType(configurationsActions.addNewAccountConfigurationComplete))
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
