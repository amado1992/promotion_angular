import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';

import { InventoryModel } from '../../models/inventory.model';
import { PageModel } from '../../../common/models/page.model';
import { AppState } from '../../../common/redux/general.reducers';
import * as inventoriesActions from '../../redux/inventories.actions';
import { Filter, FilterModel } from '../../../common/models/filter.model';
import { InventoriesAdjustmentComponent } from '../inventories-adjustment/inventories-adjustment.component';
import Swal from 'sweetalert2';
import { MessageService } from '../../../common/services/message.service';
import { SimpleModel } from 'app/main/common/models/simple.model';
import { ProviderModel } from 'app/main/providers/models/provider.model';
import { ProductModel } from 'app/main/products/models/product.model';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import * as productsActions from '../../../products/redux/products.actions';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import * as providersActions from '../../../providers/redux/providers.actions';
import { MovementModel } from '../../models/movement.model';
import { MovementUpdateComponent } from '../movements-update/movements-update.component';

@Component({
    selector: 'app-movements-index',
    templateUrl: './movements-index.component.html',
    styleUrls: ['./movements-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MovementsIndexComponent implements OnChanges, OnInit, OnDestroy {

    @Input() inventory: InventoryModel;

    public rows = [];
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
    public SortType = SortType;

    _filterForm: FormGroup;
    _filterSearch: FormGroup;
    _pageModel: PageModel;
    _filterModel: FilterModel;
    _searchFilter: boolean;

    _permissions = {
        'read': 'inventory.inventories.read',
        'create': 'inventory.inventories.create',
        'update': 'inventory.inventories.update',
        'destroy': 'inventory.inventories.destroy'
    };

    private _subscription = new Subscription();

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    _motive_movements: any = []
    showCard: boolean = true;

    public fromDate: NgbDate | null;
    public toDate: NgbDate | null;
    readonly DELIMITER_DB = '-';
    _collapseStatus = true;
    public hoveredDate: NgbDate | null = null;

    _categories: SimpleModel[];
    _brands: SimpleModel[];

    _providers: ProviderModel[];
    _loadingProvider: boolean;

    _products: ProductModel[];
    _loadingProduct: boolean;
    productIds: number[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[] = [];
    _branchOffices: BranchOfficeModel;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _modalService: NgbModal,
        private _messageService: MessageService,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter) {

        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this.onSearchFilter = debounce(this.onSearchFilter, 500);

        this.getAllProductsBySearch = debounce(this.getAllProductsBySearch, 500);
        this.getBranchOffices();
        this.getAllProviders();
    }

    ngOnChanges(changes: SimpleChanges) {
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

    onSearchFilter(): void {
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onModalAdjustmentInventoryOpen() {
        const modalRef = this._modalService.open(InventoriesAdjustmentComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });
        modalRef.componentInstance.inventory = this.inventory;
        modalRef.result.then();
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            if (state.auth.auth) {
                this._categories = state.auth.product_categories;
                this._brands = state.auth.brands;
                this._motive_movements = state.auth.motive_movements;
            }

            this.rows = state.inventoriesStore.movements?.value;
            this._pageModel.count = state.inventoriesStore.movements?.total;
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.adjustmentInventoryMovementsComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.filterAllInventoryMovementsComplete))
                .subscribe(response => {
                    this.rows = response.data.data.data;
                    this._pageModel.count = response.data.data.total;
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.getInventoryPdfComplete))
                .subscribe((pdfBlob: any) => {
                    const downloadUrl = window.URL.createObjectURL(pdfBlob.data);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = this.inventory?.id > 0 ? `Movimientos en inventario ${this.inventory.folio}.pdf` : 'Todos los movimientos en inventario.pdf';
                    link.click();

                    window.URL.revokeObjectURL(downloadUrl);
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

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.destroyMovementComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.updateMovementComplete))
                .subscribe(response => {
                    this.showCard = true;
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
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

        this._store.dispatch(inventoriesActions.filterAllInventoryMovements({
            inventory_id: this.inventory.id,
            filter: this._filterModel
        }));
    }

    showAll() {
        this.inventory = new InventoryModel();
        this.inventory.id = 0;
        this.showCard = false;
        this._store.dispatch(inventoriesActions.saveInventory({ params: this.inventory }));

        this.onClean();
    }

    getFilter(): Filter[] {
        const filters = [];

        if (!this._searchFilter) {
            if (this.fromDate) {
                filters.push({ attribute: 'created_at', operator: '>=', value: this.formatForDB(this.fromDate) });
            }

            if (this.toDate) {
                const toDateDB = this.calendar.getNext(this.toDate, 'd', 1);
                filters.push({ attribute: 'created_at', operator: '<', value: this.formatForDB(toDateDB) });
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

        this.resetForm();
        this._filterSearch.reset();
        this.fromDate = null;
        this.toDate = null;
        this.filterAll();
    }

    resetForm() {
        this._filterForm.reset();
    }

    printPdf() {
        if (this.rows.length > 0) {
            this._filterModel = {
                filters: this.getFilter(),
                search: {
                    paginate: this._pageModel.limit,
                    orderBy: this._pageModel.orderBy,
                    direction: this._pageModel.orderDir,
                    title: encodeURIComponent("pdf")
                }
            };

            if (this._pageModel.offset > 0) {
                this._filterModel.search.page = this._pageModel.offset + 1;
            }

            this._store.dispatch(inventoriesActions.getInventoryPdf({
                inventory_id: this.inventory.id,
                filter: this._filterModel
            }));
        } else {
            Swal.fire(this._messageService.BuildError('No se puede imprimir el pdf porque no existen movimientos.'));
        }
    }

    onCollapse() {
        this._collapseStatus = !this._collapseStatus;
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

    onModalUpdateMovementOpen(movement: MovementModel) {
        console.log("MOV X ", movement)
        const modalRef = this._modalService.open(MovementUpdateComponent, {
            centered: true,
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.movement = movement;
        modalRef.result.then();
    }

    onDestroy(movement: MovementModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este movimiento?', 'Eliminar movimiento')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: movement.id
                    };
                    this._store.dispatch(inventoriesActions.destroyMovement({ params: params }));
                }
            }
        );
    }

}
