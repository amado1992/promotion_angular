import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode, id } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';

import { AppState } from '../../../common/redux/general.reducers';
import * as inventoriesActions from '../../redux/inventories.actions';
import { MessageService } from '../../../common/services/message.service';
import { repeaterAnimation } from '../../../common/animations/form-repeater.animation';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import { InventoryModel } from '../../models/inventory.model';
import * as generalActions from 'app/main/common/redux/general.actions';
import { ProductModel } from 'app/main/products/models/product.model';
import * as productsActions from '../../../products/redux/products.actions';
import { UnitMeasurementModel } from 'app/main/common/models/unit-measurement.model';
import { ProviderModel } from 'app/main/providers/models/provider.model';
import * as providersActions from '../../../providers/redux/providers.actions';
import { SimpleModel } from 'app/main/common/models/simple.model';

@Component({
    selector: 'app-inventories-new',
    templateUrl: './inventories-new.component.html',
    styleUrls: ['./inventories-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [repeaterAnimation]
})
export class InventoriesNewComponent implements OnInit, AfterViewInit, OnDestroy {

    _addNewInventoryForm: FormGroup;
    _submitted = false;

    public inventories: any[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[] = [];
    _branchOffices: BranchOfficeModel;

    physicalStatus: SimpleModel[];

    private _subscription = new Subscription();

    inventory: InventoryModel;

    _area: number = 52;
    productIds: number[] = [];

    _products: ProductModel[];
    _loadingProduct: boolean;

    _unit_measurements: UnitMeasurementModel[];

    _providers: ProviderModel[];
    _loadingProvider: boolean;

    _categories: SimpleModel[];
    _brands: SimpleModel[];

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,
        private _router: Router,
        private _modalService: NgbModal) {

        this._loadingProvider = false;
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

            if (this._branchsOffices.length > 0) {
                this._addNewInventoryForm.get('branch_offices_id').setValue(this._branchsOffices[0].id);
            }

        }, 2000);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    getBranchOffices() {
        this._loadingBranchOffices = true;
        this._store.dispatch(branchofficesActions.getAllBranchOffices());
    }

    onCreate() {
        this._submitted = true;
        if (this._addNewInventoryForm.invalid) {
            return;
        }

        this.inventory = new InventoryModel();
        
        this.inventory.product_id = this._addNewInventoryForm.get('product_id').value;
        this.inventory.branch_offices_id = this._addNewInventoryForm.get('branch_offices_id').value;
        this.inventory.quantity = this._addNewInventoryForm.get('quantity').value ?? 0;
        this.inventory.sold = this._addNewInventoryForm.get('sold').value ?? 0;
        this.inventory.given = this._addNewInventoryForm.get('given').value ?? 0;
        this.inventory.sale_price = this._addNewInventoryForm.get('sale_price').value ?? 0.00;
        this.inventory.purchase_price = this._addNewInventoryForm.get('purchase_price').value ?? 0.00;
        this.inventory.revenues = this._addNewInventoryForm.get('revenues').value ?? 0.00;
        this.inventory.unit_measurements_id = this._addNewInventoryForm.get('unit_measurements_id').value;
        this.inventory.providers_id = this._addNewInventoryForm.get('providers_id').value;
        this.inventory.date_created = this._addNewInventoryForm.get('date_created').value;
        this.inventory.physical_status_id = this._addNewInventoryForm.get('physical_status').value;
        this.inventory.observation = this._addNewInventoryForm.get('observation').value;

        this._store.dispatch(inventoriesActions.addNewInventory({ params: this.inventory }));
    }

    onClose() {
        this._router.navigate(['/inventories/index']).then();
    }

    get controls() {
        return this._addNewInventoryForm.controls;
    }

    listeningActions() {
        this._subscription.add(
            this._store.subscribe((state) => {
                if (state.auth.auth) {
                    this._unit_measurements = state.auth.unit_measurements;
                    this.physicalStatus = state.auth.physical_status;
                    this._categories = state.auth.product_categories;
                    this._brands = state.auth.brands;
                }
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
                .pipe(ofType(inventoriesActions.addNewInventoryComplete))
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
        this.inventory = new InventoryModel();
        this._addNewInventoryForm = new FormGroup({
            'product_id': new FormControl('', Validators.required),
            'branch_offices_id': new FormControl('', Validators.required),
            'quantity': new FormControl(1, Validators.required),
            'sold': new FormControl(0),
            'given': new FormControl(0),
            'sale_price': new FormControl(0.00),
            'purchase_price': new FormControl(0.00),
            'revenues': new FormControl(0.00),
            'unit_measurements_id': new FormControl(2, Validators.required),
            'providers_id': new FormControl(null),
            'date_created': new FormControl(null),
            'physical_status': new FormControl('', Validators.required),
            'observation': new FormControl(''),

            // Only show
            'material_description': new FormControl(''),
            'category': new FormControl(''),
            'brand': new FormControl('')
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
        const _product = this._products.find(function (product) {
            return product.id === event;
        });

        const _category = this._categories.find(function (category) {
            return category.id === _product.categorys_id;
        });

        const _brand = this._brands.find(function (brand) {
            return brand.id === _product.brands_id;
        });

        this._addNewInventoryForm.get('material_description').setValue(_product.material_description);
        this._addNewInventoryForm.get('category').setValue(_category.name);
        this._addNewInventoryForm.get('brand').setValue(_brand.name);
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
    
    getAllProviders() {
        this._loadingProvider = true;
        this._store.dispatch(providersActions.getAllProviders());
    }

    onChangePhysicalStatus(event) {

    }
}
