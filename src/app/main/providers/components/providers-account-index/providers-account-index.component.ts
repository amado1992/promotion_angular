import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent, ColumnMode, SortType} from "@swimlane/ngx-datatable";
import {FormControl, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {debounce} from 'lodash';
import Swal from "sweetalert2";

import {ProviderModel} from "../../models/provider.model";
import {PageModel} from "../../../common/models/page.model";
import * as providersActions from "../../redux/providers.actions";
import {AppState} from "../../../common/redux/general.reducers";
import {MessageService} from "../../../common/services/message.service";
import {Filter, FilterModel} from "../../../common/models/filter.model";
import {ProviderAccountModel} from "../../models/provider-account.model";
import {PermissionService} from "../../../common/services/permission.service";
import {ProvidersAccountNewComponent} from "../providers-account-new/providers-account-new.component";
import {ProvidersAccountUpdateComponent} from "../providers-account-update/providers-account-update.component";

@Component({
    selector: 'app-providers-account-index',
    templateUrl: './providers-account-index.component.html',
    styleUrls: ['./providers-account-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProvidersAccountIndexComponent implements OnInit, OnDestroy {

    @Input() provider: ProviderModel;

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
        'read': 'provider.providers.read',
        'create': 'provider.providers.create',
        'update': 'provider.providers.update',
        'destroy': 'provider.providers.destroy'
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
                private _router: Router,
                private _messageService: MessageService,
                private _permissionService: PermissionService) {
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
        this._filterSearch.reset();
        this.filterAll();
    }

    onSearchFilter(): void {
        this._filterForm.reset();
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onClose(): void {
        this._router.navigate(['/providers/index']).then();
    }

    onModalNewAccountOpen() {
        const modalRef = this._modalService.open(ProvidersAccountNewComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.provider = this.provider;
        modalRef.result.then();
    }

    onModalUpdateAccountOpen(event, providerAccount: ProviderAccountModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(ProvidersAccountUpdateComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.provider = this.provider;
        modalRef.componentInstance.providerAccount = providerAccount;
        modalRef.result.then();
    }

    onChangeStatusAccount(providerAccount: ProviderAccountModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de cambiar el estado de esta cuenta?', 'Estado de la Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: this.provider.id,
                        account_id: providerAccount.id
                    };
                    this._store.dispatch(providersActions.changeStatusProviderAccount({params: params}));
                }
            }
        );
    }

    onDestroy(providerAccount: ProviderAccountModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar esta cuenta?', 'Eliminar Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: this.provider.id,
                        account_id: providerAccount.id
                    };
                    this._store.dispatch(providersActions.destroyProviderAccount({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.providers.providerAccounts.value;
            this._pageModel.count = state.providers.providerAccounts.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.addNewProviderAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.updateProviderAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.destroyProviderAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.changeStatusProviderAccountComplete))
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
            'bank_name': new FormControl(),
            'bank_rfc': new FormControl(),
            'number_account': new FormControl()
        });
        this._filterSearch = new FormGroup({
            'search': new FormControl()
        })
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

        this._store.dispatch(providersActions.filterAllProviderAccounts({
            id: this.provider.id,
            filter: this._filterModel
        }));
    }

    getFilter(): Filter[] {
        const filters = [];
        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'bank_name':
                        case 'bank_rfc':
                        case 'number_account': {
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
