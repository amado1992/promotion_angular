import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';

import { CustomerModel } from '../../models/customer.model';
import { PageModel } from '../../../common/models/page.model';
import { AppState } from '../../../common/redux/general.reducers';
import * as customersActions from '../../redux/customers.actions';
import { Filter, FilterModel } from '../../../common/models/filter.model';
import { MessageService } from '../../../common/services/message.service';
import { PermissionService } from '../../../common/services/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersNewComponent } from '../customers-new/customers-new.component';

@Component({
    selector: 'app-customers-index',
    templateUrl: './customers-index.component.html',
    styleUrls: ['./customers-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomersIndexComponent implements OnInit, OnDestroy {

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
        'read': 'customer.customers.read',
        'create': 'customer.customers.create',
        'update': 'customer.customers.update',
        'destroy': 'customer.customers.destroy'
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
        private _permissionService: PermissionService, private _modalService: NgbModal) {
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

    onUpdateCustomer(event, customer: CustomerModel) {
        this._store.dispatch(customersActions.saveCustomer({ params: customer }));
        this._router.navigate(['/customers/update']).then();
    }

    onDestroy(customer: CustomerModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Estás seguro de eliminar este cliente?', 'Eliminar Cliente')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: customer.id
                    };
                    this._store.dispatch(customersActions.destroyCustomer({ params: params }));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.customers.customers.value;
            this._pageModel.count = state.customers.customers.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.destroyCustomerComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.addNewCustomerComplete))
                .subscribe(response => {
                    this.filterAll();
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

        this._store.dispatch(customersActions.filterAllCustomers({ filter: this._filterModel }));
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
                            filters.push({ attribute: key, operator: 'like', value: value });
                            break;
                        }
                    }
                }
            }
        } else {
            if (this._filterSearch.value.search && this._filterSearch.value.search !== '') {
                filters.push({ attribute: 'search', operator: 'like', value: this._filterSearch.value.search });
            }
        }
        return filters;
    }

    onModalNewOpen() {
        this._modalService.open(CustomersNewComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
    }
}
