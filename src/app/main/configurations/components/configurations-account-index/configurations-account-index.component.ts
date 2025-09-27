import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent, ColumnMode, SortType} from "@swimlane/ngx-datatable";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import {PageModel} from "../../../common/models/page.model";
import {Filter, FilterModel} from "../../../common/models/filter.model";
import {AppState} from "../../../common/redux/general.reducers";
import {MessageService} from "../../../common/services/message.service";
import {AccountConfigurationModel} from "../../models/configuration.model";
import * as configurationsActions from '../../redux/configurations.actions';
import {PermissionService} from "../../../common/services/permission.service";
import {ConfigurationsAccountNewComponent} from "../configurations-account-new/configurations-account-new.component";
import {ConfigurationsAccountUpdateComponent} from "../configurations-account-update/configurations-account-update.component";

@Component({
    selector: 'app-configurations-account-index',
    templateUrl: './configurations-account-index.component.html',
    styleUrls: ['./configurations-account-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsAccountIndexComponent implements OnInit {

    @Input() _button_show;

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
        'read': 'configuration.configurations.read',
        'create': 'configuration.configurations.create',
        'update': 'configuration.configurations.update',
        'destroy': 'configuration.configurations.destroy'
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

    onModalNewAccountOpen() {
        this._modalService.open(ConfigurationsAccountNewComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
    }

    onModalUpdateAccountOpen(event, accountConfiguration: AccountConfigurationModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(ConfigurationsAccountUpdateComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.accountConfiguration = accountConfiguration;
        modalRef.result.then();
    }

    onChangeStatusAccount(accountConfiguration: AccountConfigurationModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de cambiar el estado de esta cuenta?', 'Estado de la Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: accountConfiguration.id
                    };
                    this._store.dispatch(configurationsActions.changeStatusAccountConfiguration({params: params}));
                }
            }
        );
    }

    onDestroy(accountConfiguration: AccountConfigurationModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar esta cuenta?', 'Eliminar Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: accountConfiguration.id
                    };
                    this._store.dispatch(configurationsActions.destroyAccountConfiguration({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.configurations.accountConfigurations.value;
            this._pageModel.count = state.configurations.accountConfigurations.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.addNewAccountConfigurationComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.updateAccountConfigurationComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.destroyAccountConfigurationComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.changeStatusAccountConfigurationComplete))
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

        this._store.dispatch(configurationsActions.filterAllAccountConfigurations({filter: this._filterModel}));
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
