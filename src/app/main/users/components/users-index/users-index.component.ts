import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SortType} from '@swimlane/ngx-datatable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import * as usersActions from '../../redux/users.actions';
import {UserModel} from '../../models/user.model';
import {RoleModel} from '../../../roles/models/rol.model';
import {PageModel} from '../../../common/models/page.model';
import {Filter, FilterModel} from '../../../common/models/filter.model';
import {AppState} from '../../../common/redux/general.reducers';
import {PermissionService} from '../../../common/services/permission.service';
import {MessageService} from '../../../common/services/message.service';
import {UsersNewComponent} from '../users-new/users-new.component';
import {UsersUpdateComponent} from '../users-update/users-update.component';

@Component({
    selector: 'app-users-index',
    templateUrl: './users-index.component.html',
    styleUrls: ['./users-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersIndexComponent implements OnInit, OnDestroy {

    currentUser: UserModel;

    public rows = [];
    public ColumnMode = ColumnMode;
    public SortType = SortType;

    _collapseStatus = true;

    _filterForm: FormGroup;
    _filterSearch: FormGroup;
    _pageModel: PageModel;
    _filterModel: FilterModel;
    _searchFilter: boolean;
    _roles: RoleModel[];
    _changeStatus: boolean;

    _permissions = {
        'read': 'user.users.read',
        'create': 'user.users.create',
        'update': 'user.users.update',
        'destroy': 'user.users.destroy'
    };

    _permissions_values = {
        read: true,
        create: true,
        update: true,
        destroy: true
    };

    private _subscription = new Subscription();

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
                private _actions$: Actions,
                private _permissionService: PermissionService,
                private _modalService: NgbModal,
                private _messageService: MessageService) {
        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._permissions_values = this._permissionService.checkPermissionValues(this._permissions);
        this.onSearchFilter = debounce(this.onSearchFilter, 500);
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeFilter();
        this.filterAll();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onPageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }): void {
        this._pageModel.offset = pageInfo.offset;
        this.filterAll();
    }

    onSortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }): void {
        this._pageModel.orderDir = sortInfo.sorts[0].dir;
        this._pageModel.orderBy = sortInfo.sorts[0].prop;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onChangeLimit(event): void {
        this._pageModel.limit = event;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onCollapse() {
        this._collapseStatus = !this._collapseStatus;
    }

    onFilterAll(): void {
        this._filterSearch.reset();
        this._searchFilter = false;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onClean(): void {
        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._filterModel = {
            search: {},
            filters: []
        };
        this._filterForm.reset();
        this._filterForm.get('role_id').setValue('');
        this._filterForm.get('status').setValue('');
        this._filterSearch.reset();
        this.filterAll();
    }

    onSearchFilter(): void {
        this._filterForm.reset();
        this._filterForm.get('role_id').setValue('');
        this._filterForm.get('status').setValue('');
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onModalNewUserOpen() {
        this._modalService.open(UsersNewComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
    }

    onModalUpdateUserOpen(event, user: UserModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(UsersUpdateComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.user = user;
        modalRef.result.then();
    }

    onChangeStatus(user: UserModel) {
        const params = {
            id: user.id
        };
        this._store.dispatch(usersActions.changeStatusUser({params: params}));
    }

    onDestroy(user: UserModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este usuario?', 'Eliminar Usuario')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: user.id
                    };
                    this._store.dispatch(usersActions.destroyUser({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._changeStatus = this._permissionService.checkPermission({name: this._permissions.update});

        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.users.users.value;
            this._pageModel.count = state.users.users.total;

            if (state.auth.auth) {
                this.currentUser = state.auth.auth.user;
                this._roles = state.auth.roles;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(usersActions.addNewUserComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(usersActions.updateUserComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(usersActions.changeStatusUserComplete))
                .subscribe(response => {
                    this.filterAll();
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(usersActions.destroyUserComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );
    }

    initializeFilter(): void {
        this._filterForm = new FormGroup({
            'name': new FormControl(),
            'email': new FormControl(),
            'role_id': new FormControl(''),
            'status': new FormControl('')
        });
        this._filterSearch = new FormGroup({
            'search': new FormControl()
        });
    }

    filterAll(): void {
        this._filterModel = {
            search: {
                paginate: this._pageModel.limit,
                orderBy: this._pageModel.orderBy,
                direction: this._pageModel.orderDir
            },
            filters: this.getFilter()
        };
        if (this._pageModel.offset > 0) {
            this._filterModel.search.page = this._pageModel.offset + 1;
        }

        this._store.dispatch(usersActions.filterAllUsers({filter: this._filterModel}));
    }

    getFilter(): Filter[] {
        const filters = [];
        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'name':
                        case 'email': {
                            filters.push({attribute: key, operator: 'like', value: value});
                            break;
                        }
                        case 'status':
                        case 'role_id': {
                            filters.push({attribute: key, operator: '=', value: value});
                            break;
                        }
                    }
                }
            }
        } else {
            if (this._filterSearch.value.search && this._filterSearch.value.search !== '') {
                filters.push({attribute: 'search', operator: 'like', value: this._filterSearch.value.search});
            }
        }
        return filters;
    }
}
