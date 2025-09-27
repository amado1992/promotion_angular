import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { AppState } from '../../../common/redux/general.reducers';
import { ProductModel } from '../../../products/models/product.model';
import { MessageService } from '../../../common/services/message.service';
import * as productsActions from '../../../products/redux/products.actions';
import { repeaterAnimation } from '../../../common/animations/form-repeater.animation';
import { ProductsNewComponent } from '../../../products/components/products-new/products-new.component';
import { debounce } from 'lodash';
import { DateFormatPipe } from 'app/main/common/pipes/dateFormat/date-format.pipe';
import * as IvaConstants from '../../../common/utils/iva.const';

@Component({
    selector: 'app-orders-products',
    templateUrl: './orders-products.component.html',
    styleUrls: ['./orders-products.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [repeaterAnimation]
})
export class OrdersProductsComponent implements OnInit, OnDestroy {

    @Input() products: any[];
    @Input() totals: any[];
    @Input() productIds: number[];
    @Input() branchOfficesId: any;

    @Output() newItemEvent = new EventEmitter<boolean>();

    productsComplete: any[];
    productsCompleteInit: any[];

    _products: ProductModel[];
    _loadingProduct: boolean;

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _modalService: NgbModal,
        private _messageService: MessageService,
        private _dateFormatPipe: DateFormatPipe) {
        this.getAllProductsBySearch = debounce(this.getAllProductsBySearch, 500);
        this.listeningActions();
    }

    ngOnInit(): void {
        this.productsComplete = this.products;
        this.productsCompleteInit = JSON.parse(JSON.stringify(this.products));

        if (this.productIds.length > 0) {
            this.getAllProductsBySearchUpdate()
        }
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    public trackItem(index, item) {
        return +index;
    }

    onChangeSelectedProduct(event, id) {
        if (!event) {
            this.products[id]['inventories_id'] = null;
            this.products[id]['url_complete'] = '';
            this.products[id]['amount'] = 0;
            this.products[id]['total'] = 0.00;
            this.products[id]['description'] = '';
            this.products[id]['material_description'] = '';
            this.products[id]['price'] = 0.00;
            this.products[id]['stock'] = 0;

            this.changesGeneralValues();
            return;
        }

        let iterator = 0;
        const existProduct = this.products.find(function (item) {
            if (item.inventories_id === event && iterator !== id) {
                return true;
            }
            iterator++;
        });

        if (existProduct) {
            this.products[id]['inventories_id'] = null;
            this.products[id]['url_complete'] = '';
            this.products[id]['amount'] = 0;
            this.products[id]['total'] = 0.00;
            this.products[id]['description'] = '';
            this.products[id]['material_description'] = '';
            this.products[id]['price'] = 0.00;
            this.products[id]['stock'] = 0;

            this.changesGeneralValues();

            Swal.fire(this._messageService.BuildError('El producto ya existe en el listado'));
            return;
        }

        // Only applies when editing.
        if (this.productsCompleteInit.length > 0) {
            let index = 0;
            const productExistsSameIndex = this.productsCompleteInit.find(function (item) {
                if (item.inventories_id === event && index == id) {
                    return true;
                }
                index++;
            });

            if (productExistsSameIndex) {

                this.products[id]['inventories_id'] = this.productsCompleteInit[id]['inventories_id'];
                this.products[id]['url_complete'] = this.productsCompleteInit[id]['url_complete'];
                this.products[id]['amount'] = this.productsCompleteInit[id]['amount'];
                this.products[id]['total'] = this.productsCompleteInit[id]['total'];
                this.products[id]['description'] = this.productsCompleteInit[id]['description'];
                this.products[id]['material_description'] = this.productsCompleteInit[id]['material_description'];;
                this.products[id]['price'] = this.productsCompleteInit[id]['price'];
                this.products[id]['stock'] = this.productsCompleteInit[id]['stock'];
                this.products[id]['startingAmount'] = this.productsCompleteInit[id]['startingAmount'];

                this.initTotal(id)
                this.changesGeneralValues();
                return;
            }
        }
        // End only applies when editing.

        const _product = this._products.find(function (product) {
            return product.inventories_id === event;
        });

        this.products[id]['amount'] = 0;
        this.products[id]['inventories_id'] = _product.inventories_id;
        this.products[id]['url_complete'] = _product.url_complete;
        this.products[id]['description'] = _product.description;
        this.products[id]['material_description'] = _product.material_description;
        this.products[id]['price'] = _product.sale_price;
        this.products[id]['stock'] = _product.stock;
        this.products[id]['startingAmount'] = 0;
        this.products[id]['unit_symbol'] = _product.unit_symbol;

        this.initTotal(id)
        this.changesGeneralValues();

        if (this.validProductNotExceedStock(id)) {
            this.addNewItem(true)
        } else {
            this.addNewItem(false)
        }
    }

    onBlur(who_change, event, id) {
        const val = Number(event.target.value);
        this.products[id][who_change] = parseFloat(val.toFixed(2));
    }

    onChange(who_change, event, id) {
        const val = event.target.value;

        if (['price', 'amount', 'tax'].includes(who_change)) {

            this.products[id][who_change] = parseFloat(Number(val).toFixed(2));

            if (this.validProductNotExceedStock(id)) {
                this.addNewItem(true)
            } else {
                this.addNewItem(false)
            }

            this.initTotal(id)
        }

        this.changesGeneralValues();
    }

    changeValuesToString(id, total: number) {
        total = Number(total);
        this.products[id]['total'] = parseFloat(total.toFixed(2));
    }

    changesGeneralValues() {
        let totalRevenues = 0;
        let total = 0;

        this.products.forEach(product => {
            totalRevenues += +product.total;
            total += +product.amount;
        });

        this.totals[0]['_total'] = parseFloat(totalRevenues.toFixed(2));
        this.totals[0]['_totalQuantity'] = parseFloat(total.toFixed(2));
    }

    onAddItem() {
        const row = {
            inventories_id: null,
            description: '',
            material_description: '',
            amount: 0,
            price: 0.00,
            total: 0,
            stock: 0,
            startingAmount: 0,
            unit_symbol: 'PZ'
        };

        this.productsComplete.push(row);
    }

    deleteItem(id) {
        this.productsComplete.splice(id, 1);
        this.changesGeneralValues();
        this.addNewItem(false);
    }

    onModalNewProductOpen() {
        this._modalService.open(ProductsNewComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
    }

    listeningActions() {
        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.addNewProductComplete))
                .subscribe(response => {
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.getAllProductsBySearchComplete))
                .subscribe(response => {
                    this._products = response.data.data.data;
                    this._loadingProduct = false;
                })
        );
    }

    getAllProducts() {
        this._loadingProduct = true;
        this._store.dispatch(productsActions.getAllProducts());
    }

    getAllProductsBySearch(event) {
        if (this.branchOfficesId == 0) {
            Swal.fire(this._messageService.BuildError('Por favor seleccione una sucursal antes de buscar el producto'));
            return;
        }

        this._loadingProduct = true;
        var params = {}

        // Validate and convert the search term
        const searchTerm = event.term ? event.term.toString() : '';

        params = {
            search: encodeURIComponent(searchTerm),
            branchOfficesId: this.branchOfficesId
        }

        // Add the array of IDs if not empty
        if (this.productIds.length > 0) {

            this.productIds.join(',')
            params = {
                search: encodeURIComponent(searchTerm),
                products: this.productIds,
                branchOfficesId: this.branchOfficesId
            }
        }

        // Dispatch the action of NgRx
        this._store.dispatch(productsActions.getAllProductsBySearch({ params }));
    }

    getAllProductsBySearchUpdate() {
        if (this.branchOfficesId == 0) {
            Swal.fire(this._messageService.BuildError('Por favor seleccione una sucursal antes de buscar el producto'));
            return;
        }

        this._loadingProduct = true;
        var params = {
            search: "",
            products: this.productIds.join(','),
            branchOfficesId: this.branchOfficesId
        }

        this._store.dispatch(productsActions.getAllProductsBySearch({ params }));
    }

    addNewItem(value: boolean) {
        this.newItemEvent.emit(value);
    }

    validProductNotExceedStock(id: any) {
        var max = Number.parseInt(this.products[id].startingAmount) + this.products[id].stock;

        if (Number.parseInt(this.products[id].amount) > max) {
            return true;
        }

        return false;
    }

    amountMax(id: any) {

        if (this.products[id]['inventories_id'] != null) {
            return Number.parseInt(this.products[id].startingAmount) + this.products[id].stock;
        }

        return -1;
    }

    stock(id: any) {
        if (this.products[id]['inventories_id'] != null) {

            return this.products[id].stock;
        }

        return -1
    }

    initTotal(id) {
        let totalWithoutTax: number = 0, total: number = 0;

        totalWithoutTax = parseFloat(Number(this.products[id].amount).toFixed(2)) * parseFloat(Number(this.products[id].price).toFixed(2));
        var result = totalWithoutTax * Number(IvaConstants.IVA_MEXICO) + totalWithoutTax;
        total = parseFloat(Number(result).toFixed(2));
        this.changeValuesToString(id, total);
    }
}
