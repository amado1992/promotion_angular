import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';

import { OrderModel } from '../../models/orders.model';
import { PageModel } from '../../../common/models/page.model';
import * as ordersActions from '../../redux/orders.actions';
import { Filter, FilterModel } from '../../../common/models/filter.model';
import { AppState } from '../../../common/redux/general.reducers';
import { MessageService } from '../../../common/services/message.service';
import { PermissionService } from '../../../common/services/permission.service';
import { DateFormatPipe } from 'app/main/common/pipes/dateFormat/date-format.pipe';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import * as providersActions from '../../../providers/redux/providers.actions';
import { ProviderModel } from 'app/main/providers/models/provider.model';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import { CustomerModel } from 'app/main/customers/models/customer.model';
import * as customersActions from '../../../customers/redux/customers.actions';

@Component({
    selector: 'app-orders-index',
    templateUrl: './orders-index.component.html',
    styleUrls: ['./orders-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersIndexComponent implements OnInit, OnDestroy {

    public rows = [];
    public ColumnMode = ColumnMode;
    public SortType = SortType;

    _collapseStatus = true;

    _filterForm: FormGroup;
    _filterSearch: FormGroup;
    _pageModel: PageModel;
    _filterModel: FilterModel;
    _searchFilter: boolean;

    public hoveredDate: NgbDate | null = null;
    public fromDate: NgbDate | null;
    public toDate: NgbDate | null;
    readonly DELIMITER_DB = '-';

    _permissions = {
        'read': 'order.orders.read',
        'create': 'order.orders.create',
        'update': 'order.orders.update',
        'destroy': 'order.orders.destroy'
    };

    _permissions_values = {
        read: true,
        create: true,
        update: true,
        destroy: true
    };

    private _subscription = new Subscription();

    _providers: ProviderModel[];
    _loadingProvider: boolean;

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[] = [];
    _branchOffices: BranchOfficeModel;

    _loadingCustomer = false;
    _customers: CustomerModel[];
    _customer: CustomerModel;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    public isMobileView: boolean = false;
    public order: OrderModel;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _modalService: NgbModal,
        private _messageService: MessageService,
        private _router: Router,
        private _permissionService: PermissionService,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter,
        private _dateFormatPipe: DateFormatPipe) {

        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._permissions_values = this._permissionService.checkPermissionValues(this._permissions);
        this.onSearchFilter = debounce(this.onSearchFilter, 500);

        this.getAllCustomers = debounce(this.getAllCustomers, 500);
        this.getBranchOffices();
        this.getAllProviders();

    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkViewport();
    }

    ngOnInit(): void {
        this.checkViewport();
        this.listeningActions();
        this.initializeFilter();
        this.filterAll();
    }

    checkViewport() {
        this.isMobileView = window.innerWidth <= 1280; // 1280px es el breakpoint común para tablets
    }

    isMobile() {
        return this.isMobileView;
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    getRowClass = (row) => {
        return {
            'stamp-status-cancel': row.stamp_status === 'CANCELADA'
        };
    };

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
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
        this.fromDate = null;
        this.toDate = null;
        this.filterAll();
    }

    onSearchFilter(): void {
        this._filterForm.reset();
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onUpdateOrder(order: OrderModel) {
        this._store.dispatch(ordersActions.saveOrder({ params: order }));
        this._router.navigate(['/orders/update']).then();
    }

    onDestroy(order: OrderModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar esta orden?', 'Eliminar Orden')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: order.folio
                    };
                    this._store.dispatch(ordersActions.destroyOrder({ params: params }));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(
            this._store.subscribe(state => {
                this.rows = state.ordersStore.orders.value;
                this._pageModel.count = state.ordersStore.orders.total;
            }
            )
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.destroyOrderComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.getOrdersExportExcelComplete))
                .subscribe(response => {
                    window.open(response.data.data);
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.getOrderPdfComplete))
                .subscribe((pdfBlob: any) => {
                    const date = this._dateFormatPipe.transform(this.order.date_created, 'yyyy-MM-dd');
                    const blobUrl = window.URL.createObjectURL(pdfBlob.data);

                    // 1. Crear enlace temporal para descarga con nombre
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `Orden-${this.order.folio}-${date}.pdf`;

                    // 2. Disparar la descarga
                    link.click();

                    // Limpieza
                    window.URL.revokeObjectURL(blobUrl);
                },
                    (error) => {
                        console.error('Error al descargar el PDF:', error);
                    })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(branchofficesActions.getAllBranchOfficesComplete))
                .subscribe(response => {
                    this._branchsOffices = response.data.data;
                    this._loadingBranchOffices = false;
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(providersActions.getAllProvidersComplete))
                .subscribe(response => {
                    this._providers = response.data.data;
                    this._loadingProvider = false;
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.getAllCustomersBySearchComplete))
                .subscribe(response => {
                    this._customers = response.data.data;
                    this._loadingCustomer = false;
                })
        );
    }

    initializeFilter(): void {
        this._filterForm = new FormGroup({
            'branch_offices_id': new FormControl(),
            'providers_id': new FormControl(),
            'customer_id': new FormControl()
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

        this._store.dispatch(ordersActions.filterAllOrders({ filter: this._filterModel }));
    }

    getFilter(): Filter[] {
        const filters = [];

        if (!this._searchFilter) {
            if (this.fromDate) {
                filters.push({ attribute: 'date_created', operator: '>=', value: this.formatForDB(this.fromDate) });
            }
            if (this.toDate) {
                const toDateDB = this.calendar.getNext(this.toDate, 'd', 1);
                filters.push({ attribute: 'date_created', operator: '<', value: this.formatForDB(toDateDB) });
            }
        }

        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'customer_id':
                        case 'branch_offices_id':
                        case 'providers_id': {
                            filters.push({ attribute: key, operator: '=', value: value });
                            break;
                        }
                    }
                }
            }
        } else {
            if (this._filterSearch.value.search && this._filterSearch.value.search !== '') {
                filters.push({ attribute: 'search', operator: 'like', value: encodeURIComponent(this._filterSearch.value.search.trim()) });
            }
        }

        return filters;
    }

    public formatForDB(date: NgbDateStruct | null) {
        return date ? date.year + this.DELIMITER_DB + (date.month < 10 ? '0' : '') + date.month + this.DELIMITER_DB + (date.day < 10 ? '0' : '') + date.day : '';
    }

    resultNumber(val: any) {
        if (val == undefined) {
            return 0.00;
        } else {
            return Number.parseFloat(val.toString()).toFixed(2);
        }
    }

    onExportExcel() {
        if (this.rows.length > 0) {
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

            this._store.dispatch(ordersActions.getOrdersExportExcel({ filters: this._filterModel }));
        } else {
            Swal.fire(this._messageService.BuildError('No se puede exportar el excel, debido a que no existen ordenes.'));
        }
    }

    getOrderPdf(row) {
        this.order = row;

        var params = {
            orderId: row.folio,
            name: "Orden"
        }

        this._store.dispatch(ordersActions.getOrderPdf({ params }));
    }

    getBranchOffices() {
        this._loadingBranchOffices = true;
        this._store.dispatch(branchofficesActions.getAllBranchOffices());
    }

    getAllProviders() {
        this._loadingProvider = true;
        this._store.dispatch(providersActions.getAllProviders());
    }

    getAllCustomers(event) {
        this._loadingCustomer = true;
        const params = {
            search: encodeURIComponent(event.term)
        }
        this._store.dispatch(customersActions.getAllCustomersBySearch({ params: params }));
    }
}
