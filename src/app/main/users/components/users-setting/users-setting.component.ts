import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpEventType} from '@angular/common/http';
import {Actions, ofType} from '@ngrx/effects';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import Swal from 'sweetalert2';

import * as authenticationActions from 'app/main/authentication/redux/authentication.actions';
import * as generalActions from 'app/main/common/redux/general.actions';
import {UserModel} from '../../models/user.model';
import {AppState} from '../../../common/redux/general.reducers';
import {MessageService} from '../../../common/services/message.service';
import {GeneralUtil} from '../../../common/utils/general.util';

@Component({
    selector: 'app-users-setting',
    templateUrl: './users-setting.component.html',
    styleUrls: ['./users-setting.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersSettingComponent implements OnInit, OnDestroy {

    _activeTab = 'account';

    currentUser: UserModel;
    avatar: string;
    _progress = 0;
    _uploadError = false;
    _barStatus: string;

    _accountUserForm: FormGroup;
    _branch_office_show = true;
    _submittedGeneral = false;

    _passwordTextTypeOld: boolean;
    _passwordTextTypeNew: boolean;
    _submittedPassword = false;
    _accountUserPasswordForm: FormGroup;

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
                private _actions$: Actions,
                private _messageService: MessageService,
                private _activatedRoute: ActivatedRoute) {
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

    onSaveAvatar(event) {
        if (!event.target.files[0]) {
            return;
        }
        const inpF = event.target as HTMLInputElement;

        if ((inpF.files[0] as any)) {
            const input = event.target;
            const file = input.files[0];
            const fileName = (inpF.files[0] as any).name;

            const sizeByte = file.size * 1;
            const result = sizeByte / 1024;
            const sizeKiloByte = parseInt(result + '', 10);

            if (sizeKiloByte > 1024) {
                Swal.fire(this._messageService.BuildError('El tamaño supera el máximo requerido que es de 1MB', 'Oops...')).then(() => {
                });
                return;
            }

            const params = {
                model: 'User',
                file: file,
                filename: fileName
            };
            this._store.dispatch(generalActions.fileUpload({params: params}));
        }
    }

    onResetAvatar() {
        this._accountUserForm.controls.temporaryFile_id.setValue(null);
        setTimeout(() => {
            this.avatar = this.currentUser.avatar;
        }, 10);
    }

    onSave() {
        this._submittedGeneral = true;
        if (this._accountUserForm.invalid) {
            return;
        }

        const user = {
            'name': this._accountUserForm.get('name').value,
            'last_name': this._accountUserForm.get('last_name').value,
            'email': this._accountUserForm.get('email').value,
            'phone': this._accountUserForm.get('phone').value,
            'temporary_file_id': this._accountUserForm.controls.temporaryFile_id.value
        };

        this._accountUserForm.controls.temporaryFile_id.setValue(null);
        this._store.dispatch(authenticationActions.changeAccountUserLogged({params: user}));
    }

    onCleanForm() {
        this._accountUserForm.get('name').setValue(this.currentUser.name);
        this._accountUserForm.get('last_name').setValue(this.currentUser.last_name);
        this._accountUserForm.get('email').setValue(this.currentUser.email);
        this._accountUserForm.get('phone').setValue(this.currentUser.phone);

        setTimeout(() => {
            this._submittedGeneral = false;
        }, 10);
    }

    onSavePassword() {
        this._submittedPassword = true;
        if (this._accountUserPasswordForm.invalid) {
            return;
        }

        const params = {
            'old_password': this._accountUserPasswordForm.get('old_password').value,
            'password': this._accountUserPasswordForm.get('password').value,
            'password_confirmation': this._accountUserPasswordForm.get('password_confirmation').value,
        };

        this._store.dispatch(authenticationActions.changePasswordUserLogged({params: params}));
    }

    onCleanPasswordForm() {
        this._accountUserPasswordForm.reset();
        setTimeout(() => {
            this._submittedPassword = false;
        }, 10);
    }

    get controls() {
        return this._accountUserForm.controls;
    }

    get controlsPassword() {
        return this._accountUserPasswordForm.controls;
    }

    listeningActions(): void {
        this._activatedRoute.fragment.subscribe((fragment) => {
            if (fragment === 'password') {
                this._activeTab = 'password';
            }
        });

        this._subscription.add(this._store.subscribe(state => {
            if (state.auth.auth) {
                this.currentUser = state.auth.auth.user;
                this.avatar = this.currentUser.avatar;

                if (this.currentUser.role.id <= 3) {
                    this._branch_office_show = false;
                }
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(generalActions.fileUploadComplete))
                .subscribe(response => {
                    switch (response.data.type) {
                        case HttpEventType.Sent:
                            this._uploadError = false;
                            this._progress = 0;
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            this._progress = Math.round(response.data.loaded / response.data.total * 100);
                            if (this._progress !== 100) {
                                this._barStatus = String(this._progress) + '%';
                            }
                            if (this._progress === 100) {
                                this._barStatus = 'Espere por favor';
                            }
                            break;
                        case HttpEventType.Response:
                            this._barStatus = 'Completado';
                            this._progress = 0;
                            this._accountUserForm.controls.temporaryFile_id.setValue(response.data.body.data.id);
                            this.avatar = response.data.body.data.url_complete;
                            setTimeout(() => this._barStatus = null, 1000);
                            return;
                    }
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(authenticationActions.changePasswordUserLoggedComplete))
                .subscribe(response => {
                    this.onCleanPasswordForm();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(authenticationActions.changeAccountUserLoggedComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );
    }

    initializeForm() {
        this._accountUserForm = new FormGroup({
            'name': new FormControl(this.currentUser.name, Validators.required),
            'last_name': new FormControl(this.currentUser.last_name, Validators.required),
            'email': new FormControl(this.currentUser.email, [Validators.required, Validators.email]),
            'phone': new FormControl(this.currentUser.phone, Validators.required),
            'branch_office': new FormControl({
                'value': this.currentUser.branch_office.name,
                'disabled': true
            }),
            'temporaryFile_id': new FormControl(null)
        });

        this._accountUserPasswordForm = new FormGroup({
            'old_password': new FormControl('', [Validators.required, Validators.minLength(8)]),
            'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
            'password_confirmation': new FormControl('', [Validators.required, Validators.minLength(8)]),
        }, {
            validators: GeneralUtil.matchPassword('password', 'password_confirmation')
        });
    }

    activatingFile(event) {
        event.stopPropagation();
        const thisE = event.target as HTMLButtonElement;
        const thisF = thisE.closest('div').querySelector('input') as HTMLInputElement;
        thisF.click();
    }

    togglePasswordTextTypeOld() {
        this._passwordTextTypeOld = !this._passwordTextTypeOld;
    }

    togglePasswordTextTypeNew() {
        this._passwordTextTypeNew = !this._passwordTextTypeNew;
    }
}
