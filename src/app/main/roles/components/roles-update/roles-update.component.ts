import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {Subscription} from 'rxjs';

import * as rolesActions from '../../redux/roles.actions';
import {AppState} from '../../../common/redux/general.reducers';
import {Permissions} from '../../models/permission.model';
import {RoleModel} from '../../models/rol.model';

@Component({
    selector: 'app-roles-update',
    templateUrl: './roles-update.component.html',
    styleUrls: ['./roles-update.component.scss']
})
export class RolesUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() role: RoleModel;
    _permissions: Permissions[];
    _updateRoleForm: FormGroup;
    _submitted = false;

    _flag_read = false;
    _flag_create = false;
    _flag_update = false;
    _flag_destroy = false;

    private _subscription = new Subscription();

    constructor(public _activeModal: NgbActiveModal,
                private _store: Store<AppState>,
                private _actions$: Actions) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit() {
        for (const permission of this.role.permissions) {
            (<HTMLInputElement>document.getElementById(permission.name)).checked = true;
        }

        setTimeout(() => {
            this.onChangeFlag('read');
            this.onChangeFlag('create');
            this.onChangeFlag('update');
            this.onChangeFlag('destroy');
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onCheckboxChange(event) {
        if (event.target.checked) {
            (<FormArray>this._updateRoleForm.get('role_permissions')).push(new FormControl(event.target.id));
        } else {
            const index = (<FormArray>this._updateRoleForm.get('role_permissions')).controls.findIndex(permission =>
                permission.value === event.target.id
            );
            (<FormArray>this._updateRoleForm.get('role_permissions')).removeAt(index);
        }

        this.onChangeFlag(event.target.id.split('.')[2]);
    }

    onCheckedAll(action, value) {
        for (const module of this._permissions) {
            const checkedPermission = module.permissions.find((permission: string) => permission.includes(action));
            (<HTMLInputElement>document.getElementById(checkedPermission)).checked = value;

            if (value) {
                const index = (<FormArray>this._updateRoleForm.get('role_permissions')).controls.findIndex(permission =>
                    permission.value === checkedPermission
                );
                if (index === -1) {
                    (<FormArray>this._updateRoleForm.get('role_permissions')).push(new FormControl(checkedPermission));
                }
            } else {
                const index = (<FormArray>this._updateRoleForm.get('role_permissions')).controls.findIndex(permission =>
                    permission.value === checkedPermission
                );
                (<FormArray>this._updateRoleForm.get('role_permissions')).removeAt(index);
            }
        }
        switch (action) {
            case 'read':
                this._flag_read = value;
                break
            case 'create':
                this._flag_create = value;
                break
            case 'update':
                this._flag_update = value;
                break
            case 'destroy':
                this._flag_destroy = value;
                break
        }
    }

    onChangeFlag(action) {
        let _flag = true;
        for (const module of this._permissions) {
            const checkedPermission = module.permissions.find((permission: string) => permission.includes(action));
            if (!(<HTMLInputElement>document.getElementById(checkedPermission)).checked) {
                _flag = false;
                break;
            }
        }

        switch (action) {
            case 'read':
                this._flag_read = _flag;
                break
            case 'create':
                this._flag_create = _flag;
                break
            case 'update':
                this._flag_update = _flag;
                break
            case 'destroy':
                this._flag_destroy = _flag;
                break
        }
    }

    onUpdate() {
        this._submitted = true;
        if (this._updateRoleForm.invalid) {
            return;
        }

        const permissions = [];
        for (const permission of this._updateRoleForm.get('role_permissions').value) {
            permissions.push({'permission': permission});
        }

        const roleUpdate = {
            'id': this._updateRoleForm.get('id').value,
            'name': this._updateRoleForm.get('role_name').value,
            'permissions': permissions
        };

        this._store.dispatch(rolesActions.updateRole({params: roleUpdate}));
    }

    onClose() {
        this._activeModal.close();
    }

    get controls() {
        return this._updateRoleForm.controls;
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._permissions = state.auth.permissions;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(rolesActions.updateRoleComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm() {
        this._updateRoleForm = new FormGroup({
            'id': new FormControl(this.role.id, Validators.required),
            'role_name': new FormControl(this.role.name, Validators.required),
            'role_permissions': new FormArray([], Validators.required)
        });

        for (const permission of this.role.permissions) {
            (<FormArray>this._updateRoleForm.get('role_permissions')).push(new FormControl(permission.name));
        }
    }
}
