import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent, ColumnMode, SortType} from "@swimlane/ngx-datatable";
import {FormControl, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Actions, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import {CustomerModel} from "../../models/customer.model";
import {PageModel} from "../../../common/models/page.model";
import {AppState} from "../../../common/redux/general.reducers";
import * as customersActions from "../../redux/customers.actions";
import {MessageService} from "../../../common/services/message.service";
import {Filter, FilterModel} from "../../../common/models/filter.model";
import {CustomerAccountModel} from "../../models/customer-account.model";
import {PermissionService} from "../../../common/services/permission.service";
import {CustomersAccountNewComponent} from "../customers-account-new/customers-account-new.component";
import {CustomersAccountUpdateComponent} from "../customers-account-update/customers-account-update.component";

@Component({
    selector: 'app-customers-account-index',
    templateUrl: './customers-account-index.component.html',
    styleUrls: ['./customers-account-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomersAccountIndexComponent implements OnInit, OnDestroy {

    @Input() customer: CustomerModel;

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
        this._router.navigate(['/customers/index']).then();
    }

    onModalNewAccountOpen() {
        const modalRef = this._modalService.open(CustomersAccountNewComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.customer = this.customer;
        modalRef.result.then();
    }

    onModalUpdateAccountOpen(event, customerAccount: CustomerAccountModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(CustomersAccountUpdateComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.customer = this.customer;
        modalRef.componentInstance.customerAccount = customerAccount;
        modalRef.result.then();
    }

    onChangeStatusAccount(customerAccount: CustomerAccountModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Estás seguro de cambiar el estado de esta cuenta?', 'Estado de la Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: this.customer.id,
                        account_id: customerAccount.id
                    };
                    this._store.dispatch(customersActions.changeStatusCustomerAccount({params: params}));
                }
            }
        );
    }

    onDestroy(customerAccount: CustomerAccountModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Estás seguro de eliminar esta cuenta?', 'Eliminar Cuenta')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: this.customer.id,
                        account_id: customerAccount.id
                    };
                    this._store.dispatch(customersActions.destroyCustomerAccount({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.customers.customerAccounts.value;
            this._pageModel.count = state.customers.customerAccounts.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.addNewCustomerAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.updateCustomerAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.destroyCustomerAccountComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.changeStatusCustomerAccountComplete))
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

        this._store.dispatch(customersActions.filterAllCustomerAccounts({
            id: this.customer.id,
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
