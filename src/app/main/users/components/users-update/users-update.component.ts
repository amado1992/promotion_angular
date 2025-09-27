import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import * as usersActions from '../../redux/users.actions';
import {UserModel} from '../../models/user.model';
import {BranchOfficeModel} from '../../../branch-offices/models/branch-office.model';
import {RoleModel} from '../../../roles/models/rol.model';
import {AppState} from '../../../common/redux/general.reducers';
import {GeneralUtil} from '../../../common/utils/general.util';

@Component({
    selector: 'app-users-update',
    templateUrl: './users-update.component.html',
    styleUrls: ['./users-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() user: UserModel;
    _updateUserForm: FormGroup;

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
            this.controls.user_role.setValue(this.user.role.id);
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onUpdate() {
        this._submitted = true;
        if (this._updateUserForm.invalid) {
            return;
        }

        const userUpdate = {
            'id': this._updateUserForm.get('id').value,
            'name': this._updateUserForm.get('user_name').value,
            'last_name': this._updateUserForm.get('user_last_name').value,
            'email': this._updateUserForm.get('user_email').value,
            'phone': this._updateUserForm.get('user_phone').value,
            'role_id': this._updateUserForm.get('user_role').value,
            'branch_office_id': this._updateUserForm.get('user_branch_office').value
        };

        if (this._updateUserForm.get('user_password').value || this._updateUserForm.get('user_password_confirmation').value) {
            userUpdate['password'] = this._updateUserForm.get('user_password').value;
            userUpdate['password_confirmation'] = this._updateUserForm.get('user_password_confirmation').value;
        }

        this._store.dispatch(usersActions.updateUser({params: userUpdate}));
    }

    onClose() {
        this._activeModal.close();
    }

    get controls() {
        return this._updateUserForm.controls;
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
                .pipe(ofType(usersActions.updateUserComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm() {
        this._updateUserForm = new FormGroup({
            'id': new FormControl(this.user.id, Validators.required),
            'user_name': new FormControl(this.user.name, Validators.required),
            'user_last_name': new FormControl(this.user.last_name, Validators.required),
            'user_email': new FormControl(this.user.email, [Validators.required, Validators.email]),
            'user_password': new FormControl('', Validators.minLength(8)),
            'user_password_confirmation': new FormControl('', Validators.minLength(8)),
            'user_phone': new FormControl(this.user.phone, Validators.required),
            'user_role': new FormControl(this.user.role.id, Validators.required),
            'user_branch_office': new FormControl(this.user.branch_office.id, Validators.required),
        }, {
            validators: GeneralUtil.matchPassword('user_password', 'user_password_confirmation')
        });
    }

    togglePasswordTextType() {
        this._passwordTextType = !this._passwordTextType;
    }

    setValidators() {
        const branch_office = this._updateUserForm.get('user_branch_office');

        this._updateUserForm.get('user_role').valueChanges
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
