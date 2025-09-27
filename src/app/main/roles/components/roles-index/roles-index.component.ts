import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SortType} from '@swimlane/ngx-datatable';
import {FormControl, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import * as authenticationActions from '../../../authentication/redux/authentication.actions';
import * as rolesActions from '../../redux/roles.actions';
import {PageModel} from '../../../common/models/page.model';
import {Filter, FilterModel} from '../../../common/models/filter.model';
import {AppState} from '../../../common/redux/general.reducers';
import {MessageService} from '../../../common/services/message.service';
import {PermissionService} from '../../../common/services/permission.service';
import {RolesNewComponent} from '../roles-new/roles-new.component';
import {RoleModel} from '../../models/rol.model';
import {RolesUpdateComponent} from '../roles-update/roles-update.component';

@Component({
    selector: 'app-roles-index',
    templateUrl: './roles-index.component.html',
    styleUrls: ['./roles-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RolesIndexComponent implements OnInit, OnDestroy {

    public rows = [];
    public ColumnMode = ColumnMode;
    public SortType = SortType;

    _collapseStatus = true;

    _filterForm: FormGroup;
    _filterSearch: FormGroup;
    _pageModel: PageModel;
    _filterModel: FilterModel;
    _searchFilter: boolean;

    _permissions = {
        'read': 'user.roles.read',
        'create': 'user.roles.create',
        'update': 'user.roles.update',
        'destroy': 'user.roles.destroy'
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
                private _modalService: NgbModal,
                private _messageService: MessageService,
                private _permissionService: PermissionService) {
        this._pageModel = new PageModel();
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
        this._filterModel = {
            search: {},
            filters: []
        };
        this._filterForm.reset();
        this._filterSearch.reset();
        this.filterAll();
    }

    onSearchFilter(): void {
        this._filterForm.reset();
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onModalNewRoleOpen() {
        this._modalService.open(RolesNewComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static'
        });
    }

    onModalUpdateRoleOpen(event, role: RoleModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(RolesUpdateComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static'
        });
        modalRef.componentInstance.role = role;
        modalRef.result.then();
    }

    onDestroy(role: RoleModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este rol?', 'Eliminar Rol')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: role.id
                    };
                    this._store.dispatch(rolesActions.destroyRole({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.roles.roles.value;
            this._pageModel.count = state.roles.roles.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(rolesActions.addNewRoleComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    this._store.dispatch(authenticationActions.updateRolesInAuthState());
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(rolesActions.updateRoleComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    this._store.dispatch(authenticationActions.updateRolesInAuthState());
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(rolesActions.destroyRoleComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    this._store.dispatch(authenticationActions.updateRolesInAuthState());
                })
        );
    }

    initializeFilter(): void {
        this._filterForm = new FormGroup({
            'name': new FormControl()
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

        this._store.dispatch(rolesActions.filterAllRoles({filter: this._filterModel}));
    }

    getFilter(): Filter[] {
        const filters = [];
        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'name': {
                            filters.push({attribute: key, operator: 'like', value: value});
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
