import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import * as usersActions from '../../redux/users.actions';
import {GeneralUtil} from '../../../common/utils/general.util';
import {AppState} from '../../../common/redux/general.reducers';
import {RoleModel} from '../../../roles/models/rol.model';
import {BranchOfficeModel} from '../../../branch-offices/models/branch-office.model';

@Component({
    selector: 'app-users-new',
    templateUrl: './users-new.component.html',
    styleUrls: ['./users-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersNewComponent implements OnInit, AfterViewInit, OnDestroy {

    _addNewUserForm: FormGroup;
    _branch_offices: BranchOfficeModel[];
    _branch_office_show = true;

    _passwordTextType: boolean;
    _roles: RoleModel[];
    _submitted = false;

    private _subscription = new Subscription();

    constructor(public _activeModal: NgbActiveModal,
                private _store: Store<AppState>,
                private _actions$: Actions) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
        this.setValidators();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this._branch_offices.length === 1) {
                this.controls.user_branch_office.setValue(this._branch_offices[0].id);
            }
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onCreate(): void {
        this._submitted = true;
        if (this._addNewUserForm.invalid) {
            return;
        }

        const user = {
            'name': this._addNewUserForm.get('user_name').value,
            'last_name': this._addNewUserForm.get('user_last_name').value,
            'email': this._addNewUserForm.get('user_email').value,
            'password': this._addNewUserForm.get('user_password').value,
            'password_confirmation': this._addNewUserForm.get('user_password_confirmation').value,
            'phone': this._addNewUserForm.get('user_phone').value,
            'role_id': this._addNewUserForm.get('user_role').value,
            'branch_office_id': this._addNewUserForm.get('user_branch_office').value
        };

        this._store.dispatch(usersActions.addNewUser({params: user}));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._addNewUserForm.controls;
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._roles = state.auth.roles;
                this._branch_offices = state.auth.branch_offices;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(usersActions.addNewUserComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._addNewUserForm = new FormGroup({
            'user_name': new FormControl('', Validators.required),
            'user_last_name': new FormControl('', Validators.required),
            'user_email': new FormControl('', [Validators.required, Validators.email]),
            'user_password': new FormControl('', [Validators.required, Validators.minLength(8)]),
            'user_password_confirmation': new FormControl('', [Validators.required, Validators.minLength(8)]),
            'user_phone': new FormControl('', Validators.required),
            'user_role': new FormControl('', Validators.required),
            'user_branch_office': new FormControl('', Validators.required),
        }, {
            validators: GeneralUtil.matchPassword('user_password', 'user_password_confirmation')
        });
    }

    togglePasswordTextType() {
        this._passwordTextType = !this._passwordTextType;
    }

    setValidators() {
        const branch_office = this._addNewUserForm.get('user_branch_office');

        this._addNewUserForm.get('user_role').valueChanges
            .subscribe(role => {
                if (role === 3) {
                    branch_office.setValidators(null);
                    branch_office.setValue('');
                    this._branch_office_show = false;
                } else {
                    branch_office.setValidators([Validators.required]);
                    this._branch_office_show = true;
                }

                branch_office.updateValueAndValidity();
            });
    }
}
