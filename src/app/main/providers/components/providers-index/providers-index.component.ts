import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent, ColumnMode, SortType} from '@swimlane/ngx-datatable';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import * as providersActions from '../../redux/providers.actions';
import {PageModel} from '../../../common/models/page.model';
import {Filter, FilterModel} from '../../../common/models/filter.model';
import {AppState} from '../../../common/redux/general.reducers';
import {MessageService} from '../../../common/services/message.service';
import {PermissionService} from '../../../common/services/permission.service';
import {ProviderModel} from '../../models/provider.model';

@Component({
    selector: 'app-providers-index',
    templateUrl: './providers-index.component.html',
    styleUrls: ['./providers-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProvidersIndexComponent implements OnInit, OnDestroy {

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

    onUpdateProvider(event, provider: ProviderModel) {
        this._store.dispatch(providersActions.saveProvider({params: provider}));
        this._router.navigate(['/providers/update']).then();
    }

    onDestroy(provider: ProviderModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este proveedor?', 'Eliminar proveedor')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: provider.id
                    };
                    this._store.dispatch(providersActions.destroyProvider({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.providers.providers.value;
            this._pageModel.count = state.providers.providers.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.destroyProviderComplete))
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
            'reason_social': new FormControl(),
            'rfc': new FormControl(),
            'email': new FormControl(),
            'cellphone': new FormControl()
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

        this._store.dispatch(providersActions.filterAllProviders({filter: this._filterModel}));
    }

    getFilter(): Filter[] {
        const filters = [];
        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'reason_social':
                        case 'rfc':
                        case 'email':
                        case 'cellphone': {
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
