import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';

import { InventoryModel } from '../../models/inventory.model';
import { PageModel } from '../../../common/models/page.model';
import * as inventoriesActions from '../../redux/inventories.actions';
import { Filter, FilterModel } from '../../../common/models/filter.model';
import { AppState } from '../../../common/redux/general.reducers';
import { MessageService } from '../../../common/services/message.service';
import { PermissionService } from '../../../common/services/permission.service';
import { SimpleModel } from 'app/main/common/models/simple.model';
import * as productsActions from '../../../products/redux/products.actions';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import * as providersActions from '../../../providers/redux/providers.actions';
import { ProviderModel } from 'app/main/providers/models/provider.model';
import { ProductModel } from 'app/main/products/models/product.model';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';

@Component({
    selector: 'app-inventories-index',
    templateUrl: './inventories-index.component.html',
    styleUrls: ['./inventories-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InventoriesIndexComponent implements OnInit, OnDestroy {

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

    _categories: SimpleModel[];
    _brands: SimpleModel[];
    _motive_movements: any = [];

    _providers: ProviderModel[];
    _loadingProvider: boolean;

    _products: ProductModel[];
    _loadingProduct: boolean;
    productIds: number[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[] = [];
    _branchOffices: BranchOfficeModel;

    _permissions = {
        'read': 'inventory.inventories.read',
        'create': 'inventory.inventories.create',
        'update': 'inventory.inventories.update',
        'destroy': 'inventory.inventories.destroy'
    };

    _permissions_values = {
        read: true,
        create: true,
        update: true,
        destroy: true
    };

    private _subscription = new Subscription();

    title: string = 'Inventario';
    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    public isMobileView: boolean = false;
    @Input() navFilled: NgbNav;

    filters: any = [];

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _modalService: NgbModal,
        private _messageService: MessageService,
        private _router: Router,
        private _permissionService: PermissionService,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter) {

        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._permissions_values = this._permissionService.checkPermissionValues(this._permissions);
        this.onSearchFilter = debounce(this.onSearchFilter, 500);

        this.getAllProductsBySearch = debounce(this.getAllProductsBySearch, 500);
        this.getBranchOffices();
        this.getAllProviders();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkViewport();
    }

    ngOnInit(): void {
        this.initInventoryMovements();
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
        this.filterAllSearch();
    }

    onClean(): void {
        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._filterModel = {
            search: {},
            filters: []
        };

        this.resetForm();
        this._filterSearch.reset();
        this.fromDate = null;
        this.toDate = null;
        this.filterAllSearch();
    }

    onSearchFilter(): void {
        this.resetForm();
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAllSearch();
    }

    resetForm() {
        this._filterForm.reset();
    }

    onUpdateInventory(inventory: InventoryModel) {
        this._store.dispatch(inventoriesActions.saveInventory({ params: inventory }));
        this._router.navigate(['/inventories/update']).then();
    }

    onDestroy(inventory: InventoryModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este inventario?', 'Eliminar Inventario')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: inventory.id
                    };
                    this._store.dispatch(inventoriesActions.destroyInventory({ params: params }));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._categories = state.auth.product_categories;
                this._brands = state.auth.brands;
                this._motive_movements = state.auth.motive_movements;

                this.filters = state.inventoriesStore.filters ?? [];
                console.log("FILTERS ", this.filters)
            }
        }));

        this._subscription.add(
            this._store.subscribe(state => {
                this.rows = state.inventoriesStore.inventories.value;
                this._pageModel.count = state.inventoriesStore.inventories.total;
            }
            )
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.destroyInventoryComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.getInventoriesExportExcelComplete))
                .subscribe(response => {
                    window.open(response.data.data);
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
                .pipe(ofType(productsActions.getProductsBySearchComplete))
                .subscribe(response => {
                    this._products = response.data.data;
                    this._loadingProduct = false;
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

    }

    initializeFilter(): void {
        this._filterForm = new FormGroup({
            'motive_movement_id': new FormControl(null),
            'categorys_id': new FormControl(null),
            'brands_id': new FormControl(null),
            'product_id': new FormControl(null),
            'branch_offices_id': new FormControl(null),
            'providers_id': new FormControl(null)
        });

        this._filterSearch = new FormGroup({
            'search': new FormControl()
        });
    }

    filterAll(): void {
        this.loadFiltersFromStorage(this.filters);
        
        this._filterModel = {
            search: {
                paginate: this._pageModel.limit,
                orderBy: this._pageModel.orderBy,
                direction: this._pageModel.orderDir
            },
            filters: this.filters
        };
        if (this._pageModel.offset > 0) {
            this._filterModel.search.page = this._pageModel.offset + 1;
        }

        this._store.dispatch(inventoriesActions.filterAllInventories({ filter: this._filterModel }));
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
                        case 'motive_movement_id':
                        case 'product_id':
                        case 'branch_offices_id':
                        case 'providers_id':
                        case 'categorys_id':
                        case 'brands_id': {
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
                filters: this.getFilterExportExcel(),
                search: {
                    paginate: this._pageModel.limit,
                    orderBy: this._pageModel.orderBy,
                    direction: this._pageModel.orderDir,
                    title: encodeURIComponent(this.title)
                }
            };

            if (this._pageModel.offset > 0) {
                this._filterModel.search.page = this._pageModel.offset + 1;
            }

            this._store.dispatch(inventoriesActions.getInventoriesExportExcel({ filters: this._filterModel }));
        } else {
            Swal.fire(this._messageService.BuildError('No se puede exportar el excel, debido a que no existen inventarios.'));
        }
    }

    getFilterExportExcel(): Filter[] {
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
                        case 'motive_movement_id':
                        case 'product_id':
                        case 'branch_offices_id':
                        case 'providers_id':
                        case 'categorys_id':
                        case 'brands_id': {
                            filters.push({ attribute: key, operator: '=', value: value });
                            break;
                        }
                    }
                }
            }

        } else {
            if (this._filterSearch.value.search && this._filterSearch.value.search !== '') {
                filters.push({ attribute: 'search', operator: 'like', value: this._filterSearch.value.search.trim() });
            }
        }

        return filters;
    }

    onInventoryMovements($event, inventory) {
        this._store.dispatch(inventoriesActions.saveInventory({ params: inventory }));
        this.navFilled.select(2);
    }

    getAllProductsBySearch(event) {
        this._loadingProduct = true;
        var params = {}

        // Validate and convert the search term
        const searchTerm = event.term ? event.term.toString() : '';

        params = {
            search: encodeURIComponent(searchTerm)
        }

        // Add the array of IDs if not empty
        if (this.productIds.length > 0) {

            this.productIds.join(',')
            params = {
                search: encodeURIComponent(searchTerm),
                products: this.productIds
            }
        }

        // Dispatch the action of NgRx
        this._store.dispatch(productsActions.getProductsBySearch({ params }));
    }

    getBranchOffices() {
        this._loadingBranchOffices = true;
        this._store.dispatch(branchofficesActions.getAllBranchOffices());
    }

    getAllProviders() {
        this._loadingProvider = true;
        this._store.dispatch(providersActions.getAllProviders());
    }

    initInventoryMovements() {
        var inventory = new InventoryModel();
        inventory.id = 0;
        this._store.dispatch(inventoriesActions.saveInventory({ params: inventory }));
    }

    onSaveFilters(filters: any) {
        this._store.dispatch(inventoriesActions.saveInventoriesFilters({ params: filters }));
    }

    filterAllSearch(): void {
        this.filters = JSON.parse(JSON.stringify(this.getFilter()));
        this.onSaveFilters(this.filters);

        this._filterModel = {
            search: {
                paginate: this._pageModel.limit,
                orderBy: this._pageModel.orderBy,
                direction: this._pageModel.orderDir
            },
            filters: this.filters
        };
        if (this._pageModel.offset > 0) {
            this._filterModel.search.page = this._pageModel.offset + 1;
        }

        this._store.dispatch(inventoriesActions.filterAllInventories({ filter: this._filterModel }));
    }

    loadFiltersFromStorage(filters: Filter[]) {
        // Resetear ambos formularios primero
        this._filterForm.reset();
        this._filterSearch.reset();
        this.fromDate = null;
        this.toDate = null;

        // Procesar cada filtro del array
        filters.forEach(filter => {
            // Manejar filtros de _filterForm
            if (['motive_movement_id', 'categorys_id', 'brands_id', 'product_id',
                'branch_offices_id', 'providers_id'].includes(filter.attribute)) {
                this._filterForm.get(filter.attribute)?.setValue(filter.value);
            }

            // Manejar filtro de búsqueda
            else if (filter.attribute === 'search') {
                const searchValue = decodeURIComponent(filter.value);
                this._filterSearch.get('search')?.setValue(searchValue);
                this._searchFilter = true;
            }

            // Manejar fechas (fromDate y toDate)
            else if (filter.attribute === 'date_created') {
                const dateValue = new Date(filter.value);

                if (filter.operator === '>=') {
                    // Convertir Date a NgbDate para fromDate
                    this.fromDate = new NgbDate(
                        dateValue.getFullYear(),
                        dateValue.getMonth() + 1, // Los meses en Date son 0-based
                        dateValue.getDate()
                    );
                } else if (filter.operator === '<') {
                    // Restar un día ya que originalmente se agregó un día extra
                    dateValue.setDate(dateValue.getDate() - 1);
                    // Convertir Date a NgbDate para toDate
                    this.toDate = new NgbDate(
                        dateValue.getFullYear(),
                        dateValue.getMonth() + 1,
                        dateValue.getDate()
                    );
                }
            }
        });
    }
}
