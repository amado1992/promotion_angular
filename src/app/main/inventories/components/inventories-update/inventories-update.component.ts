import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';

import * as inventoriesActions from '../../redux/inventories.actions';
import { AppState } from '../../../common/redux/general.reducers';
import { MessageService } from '../../../common/services/message.service';
import { InventoryModel } from '../../models/inventory.model';
import { repeaterAnimation } from '../../../common/animations/form-repeater.animation';
import { DateFormatPipe } from 'app/main/common/pipes/dateFormat/date-format.pipe';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import { ProductModel } from 'app/main/products/models/product.model';
import * as productsActions from '../../../products/redux/products.actions';
import * as providersActions from '../../../providers/redux/providers.actions';
import { SimpleModel } from 'app/main/common/models/simple.model';
import { UnitMeasurementModel } from 'app/main/common/models/unit-measurement.model';
import { ProviderModel } from 'app/main/providers/models/provider.model';

@Component({
    selector: 'app-inventories-update',
    templateUrl: './inventories-update.component.html',
    styleUrls: ['./inventories-update.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [repeaterAnimation]
})
export class InventoriesUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    inventory: InventoryModel;
    _updateInventoryForm: FormGroup;
    _submitted = false;

    public inventories: any[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[];
    _branchOffices: BranchOfficeModel;

    productIds: number[] = [];

    private _subscription = new Subscription();

    _products: ProductModel[];
    _loadingProduct: boolean;

    _categories: SimpleModel[];
    _brands: SimpleModel[];
    physicalStatus: SimpleModel[];
    _unit_measurements: UnitMeasurementModel[];

    _providers: ProviderModel[];
    _loadingProvider: boolean;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,
        private _router: Router,
        private _modalService: NgbModal,
        private _dateFormatPipe: DateFormatPipe) {

        this.inventory = new InventoryModel();

        this.getAllProductsBySearch = debounce(this.getAllProductsBySearch, 500);
        this.getBranchOffices();
        this.getAllProviders();
    }

    ngOnInit(): void {
        this.getProductsInit();
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.inventory.branchOffices) {
                this._branchsOffices = [this.inventory.branchOffices];
                this._updateInventoryForm.get('branch_offices_id').setValue(this.inventory.branch_offices_id);
                this.onChangeBranchOffices(this.inventory.branch_offices_id);
            }

            if (this.inventory.product) {
                this._products = [this.inventory.product];
                this._updateInventoryForm.get('product_id').setValue(this.inventory.product_id);
                this.onChangeSelectedProduct(this.inventory.product_id)
            }

            if (this.inventory.provider) {
                this._providers = [this.inventory.provider];
                this._updateInventoryForm.get('providers_id').setValue(this.inventory.providers_id);
                this.onChangeSelectedProduct(this.inventory.providers_id)
            }

            if (this.inventory.unitMeasurement) {
                this._unit_measurements = [this.inventory.unitMeasurement];
                this._updateInventoryForm.get('unit_measurements_id').setValue(this.inventory.unit_measurements_id);
            }

        }, 1000);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onUpdate() {
        this._submitted = true;

        if (this._updateInventoryForm.invalid) {
            return;
        }
        let id = this.inventory.id;

        this.inventory = new InventoryModel();
        this.inventory.id = id;

        this.inventory.product_id = this._updateInventoryForm.get('product_id').value;
        this.inventory.branch_offices_id = this._updateInventoryForm.get('branch_offices_id').value;
        this.inventory.quantity = this._updateInventoryForm.get('quantity').value ?? 0;
        this.inventory.sold = this._updateInventoryForm.get('sold').value ?? 0;
        this.inventory.given = this._updateInventoryForm.get('given').value ?? 0;
        this.inventory.sale_price = this._updateInventoryForm.get('sale_price').value ?? 0.00;
        this.inventory.purchase_price = this._updateInventoryForm.get('purchase_price').value ?? 0.00;
        this.inventory.revenues = this._updateInventoryForm.get('revenues').value ?? 0.00;
        this.inventory.unit_measurements_id = this._updateInventoryForm.get('unit_measurements_id').value;
        this.inventory.providers_id = this._updateInventoryForm.get('providers_id').value;
        this.inventory.date_created = this._updateInventoryForm.get('date_created').value;
        this.inventory.physical_status_id = this._updateInventoryForm.get('physical_status').value;
        this.inventory.observation = this._updateInventoryForm.get('observation').value;

        this._store.dispatch(inventoriesActions.updateInventory({ params: this.inventory }));
    }

    onClose() {
        this._router.navigate(['/inventories/index']).then();
    }

    get controls() {
        return this._updateInventoryForm.controls;
    }

    listeningActions() {
        this._subscription.add(
            this._store.subscribe((state) => {
                if (state.auth.auth) {
                    this.inventory = state.inventoriesStore.inventory;
                    this._unit_measurements = state.auth.unit_measurements;
                    this.physicalStatus = state.auth.physical_status;
                    this._categories = state.auth.product_categories;
                    this._brands = state.auth.brands;
                }
            })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.updateInventoryComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    setTimeout(() => {
                        this._router.navigate(['/inventories/index']).then();
                    }, 300);
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

    initializeForm(): void {
        const date = this._dateFormatPipe.transform(this.inventory.date_created, 'yyyy-MM-dd');

        this._updateInventoryForm = new FormGroup({
            'product_id': new FormControl(this.inventory.product_id, Validators.required),
            'branch_offices_id': new FormControl(this.inventory.branch_offices_id, Validators.required),
            'quantity': new FormControl(this.inventory.quantity, Validators.required),
            'sold': new FormControl(this.inventory.sold),
            'given': new FormControl(this.inventory.given),
            'sale_price': new FormControl(this.inventory.sale_price),
            'purchase_price': new FormControl(this.inventory.purchase_price),
            'revenues': new FormControl(this.inventory.revenues),
            'unit_measurements_id': new FormControl(this.inventory.unit_measurements_id, Validators.required),
            'providers_id': new FormControl(this.inventory.providers_id),
            'date_created': new FormControl(date),
            'physical_status': new FormControl(this.inventory.physical_status_id, Validators.required),
            'observation': new FormControl(this.inventory.observation),

            // Only show
            'material_description': new FormControl(''),
            'category': new FormControl(''),
            'brand': new FormControl('')
        });
    }

    getBranchOffices() {
        this._loadingBranchOffices = true;
        this._store.dispatch(branchofficesActions.getAllBranchOffices());
    }

    onChangeBranchOffices(event) {
        if (!event) {
            this._branchOffices = null;
            return;
        }
        this._branchOffices = this._branchsOffices.find(function (branchOffices) {
            return branchOffices.id === event;
        });
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

    getAllProviders() {
        this._loadingProvider = true;
        this._store.dispatch(providersActions.getAllProviders());
    }

    onChangePhysicalStatus(event) {

    }

    getProductsInit() {
        this._loadingProduct = true;
        var params = {}

        // Validate and convert the search term
        const searchTerm = '';

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

    onChangeSelectedProduct(event) {

        if (event == undefined || event == null) {
            this._updateInventoryForm.get('material_description').setValue("");
            this._updateInventoryForm.get('category').setValue("");
            this._updateInventoryForm.get('brand').setValue("");

            return;
        }

        const _product = this._products.find(function (product) {
            return product.id === event;
        });

        if (_product != undefined) {
            const _category = this._categories.find(function (category) {
                return category.id === _product.categorys_id;
            });

            const _brand = this._brands.find(function (brand) {
                return brand.id === _product.brands_id;
            });

            this._updateInventoryForm.get('material_description').setValue(_product.material_description);
            this._updateInventoryForm.get('category').setValue(_category != undefined ? _category.name : "");
            this._updateInventoryForm.get('brand').setValue(_brand != undefined ? _brand.name : "");
        } else {
            this._updateInventoryForm.get('material_description').setValue("");
            this._updateInventoryForm.get('category').setValue("");
            this._updateInventoryForm.get('brand').setValue("");
        }

    }
}
