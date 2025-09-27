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

import * as ordersActions from '../../redux/orders.actions';
import { AppState } from '../../../common/redux/general.reducers';
import { UseCFDIModel } from '../../../common/models/use-cfdi.model';
import { CustomerModel } from '../../../customers/models/customer.model';
import { MessageService } from '../../../common/services/message.service';
import { OrderModel, TemporaryFileDto } from '../../models/orders.model';
import * as customersActions from '../../../customers/redux/customers.actions';
import { repeaterAnimation } from '../../../common/animations/form-repeater.animation';
import { DateFormatPipe } from 'app/main/common/pipes/dateFormat/date-format.pipe';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import { HttpEventType } from '@angular/common/http';
import * as generalActions from 'app/main/common/redux/general.actions';
import * as productsActions from '../../../products/redux/products.actions';

@Component({
    selector: 'app-orders-update',
    templateUrl: './orders-update.component.html',
    styleUrls: ['./orders-update.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [repeaterAnimation]
})
export class OrdersUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    order: OrderModel;
    _updateOrderForm: FormGroup;
    _submitted = false;

    _use_cfdis: UseCFDIModel[];

    _loadingCustomer = false;
    _customers: CustomerModel[];
    _customer: CustomerModel;

    public orders: any[] = [];

    _products: any[] = [];
    _totals: any[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[];
    _branchOffices: BranchOfficeModel;

    sex =
        [{ id: 'MASCULINO', name: 'Masculino' },
        { id: 'FEMENINO', name: 'Femenino' },
        ];

    image: string = '';
    files: TemporaryFileDto[] = [];
    urls: any[] = [];
    url_file: string = '';
    urlsComplete: any[] = [];
    _progress = 0;
    _uploadError = false;
    _barStatus: string;

    productIds: number[] = [];

    private _subscription = new Subscription();

    quantityExcessProduct: boolean = false;

    branchOfficesId: any = 0;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,
        private _router: Router,
        private _modalService: NgbModal,
        private _dateFormatPipe: DateFormatPipe) {
        this.getAllCustomers = debounce(this.getAllCustomers, 500);
        this.getBranchOffices();
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.order.customer) {
                this._customers = [this.order.customer];
                this._updateOrderForm.get('customer_reason_social').setValue(this.order.customer.id);
                this.onChangeCustomer(this.order.customer.id);
            }

            if (this.order.branchOffices) {
                this._branchsOffices = [this.order.branchOffices];
                this._updateOrderForm.get('branchOfficesId').setValue(this.order.branchOffices.id);
                this.onChangeBranchOffices(this.order.branchOffices.id);
            }

            this.setValidators();

        }, 1000);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onChangeCustomer(event) {
        if (!event) {
            this._customer = null;
            this._updateOrderForm.get('address').setValue('');
            this._updateOrderForm.get('phone').setValue('');
            this._updateOrderForm.get('cellphone').setValue('');
            this._updateOrderForm.get('customer_email').setValue('');
            return;
        }

        this._customer = this._customers.find(function (customer) {
            return customer.id === event;
        });

        this._updateOrderForm.get('cellphone').setValue(this._customer.cellphone);
        this._updateOrderForm.get('customer_email').setValue(this._customer.email);
        this._updateOrderForm.get('phone').setValue(this._customer.phone);
        this._updateOrderForm.get('address').setValue(this._customer.inline_address);
    }

    onUpdate() {
        this._submitted = true;
        if (this._updateOrderForm.invalid) {
            return;
        }

        if (this._products.length === 0) {
            Swal.fire(this._messageService.BuildError('Debe existir al menos un producto.'));
            return;
        }

        let existProductNotSelect = false;
        let productWithoutAmount = false;

        this._products.forEach(product => {
            if (!product.inventories_id) {
                existProductNotSelect = true;
                return;
            }

            if (Number.parseInt(product.amount) <= 0) {
                productWithoutAmount = true;
                return;
            }
        });

        if (existProductNotSelect) {
            Swal.fire(this._messageService.BuildError('El producto ya existe en el listado'));
            return;
        }

        if (productWithoutAmount) {
            Swal.fire(this._messageService.BuildError('Agregue una cantidad al producto'));
            return;
        }

        if (this.quantityExcessProduct) {
            Swal.fire(this._messageService.BuildError('Ha excedido la cantidad de producto'));
            return;
        }

        let folio = this.order.folio;

        this.order = new OrderModel();
        this.order.customer_id = this._updateOrderForm.get('customer_reason_social').value;
        this.order.branch_offices_id = this._updateOrderForm.get('branchOfficesId').value;
        this.order.products = this._products;
        this.order.total_revenues = this._totals.length > 0 ? this._totals[0]['_total'] : 0.00;
        this.order.folio = folio;
        this.order.url_file = this.url_file;
        this.order.total_quantity = this._totals.length > 0 ? this._totals[0]['_totalQuantity'] : 0.00;
        this.order.observation = this._updateOrderForm.get('observation').value;

        this._store.dispatch(ordersActions.updateOrder({ params: this.order }));
    }

    onClose() {
        this._router.navigate(['/orders/index']).then();
    }

    get controls() {
        return this._updateOrderForm.controls;
    }

    listeningActions() {
        this._subscription.add(
            this._store.subscribe((state) => {
                if (state.auth.auth) {
                    this._use_cfdis = state.auth.use_cfdis;
                    this.order = state.ordersStore.order;
                }
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

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.updateOrderComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    setTimeout(() => {
                        this._router.navigate(['/orders/index']).then();
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
                .pipe(ofType(productsActions.addNewProductComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(generalActions.fileUploadMultipleComplete))
                .subscribe(response => {
                    switch (response.data.type) {
                        case HttpEventType.Sent:
                            this._uploadError = false;
                            this._progress = 0;
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            this._progress = Math.round(response.data.loaded / response.data.total * 100);
                            if (this._progress !== 100) {
                                this._barStatus = String(this._progress) + '%';
                            }
                            if (this._progress === 100) {
                                this._barStatus = 'Espere por favor';
                            }
                            break;
                        case HttpEventType.Response:
                            this._barStatus = 'Completado';
                            this._progress = 0;

                            this.files = [...response.data.body.data]

                            for (let i = 0; i < this.files.length; i++) {
                                this.urls.push(this.files[i].url);
                                this.urlsComplete.push(this.files[i].url_complete);
                            }
                            const urls = this.urls.join(',');
                            this.url_file = urls;

                            setTimeout(() => this._barStatus = null, 1000);
                            return;
                    }
                })
        );
    }

    initializeForm(): void {
        const date = this._dateFormatPipe.transform(this.order.expiration_date, 'yyyy-MM-dd');

        this.url_file = this.order.url_file;
        this.urlsComplete = [...this.order.url_complete.split(',')];

        this._updateOrderForm = new FormGroup({
            'customer_reason_social': new FormControl(this.order.customer?.id, Validators.required),
            'customer_email': new FormControl(this.order.customer?.email),
            'phone': new FormControl(this.order.customer?.phone),
            'branchOfficesId': new FormControl(this.order.branch_offices_id, Validators.required),
            'observation': new FormControl(this.order.observation),
            'cellphone': new FormControl(this.order.customer?.cellphone),
            'address': new FormControl(this.order.customer?.inline_address),
        });

        var self = this;
        var products = this.order?.customer?.order_products.filter(function (product) {
            return product.folio == self.order.folio;
        });

        products.forEach(orderProduct => {
            const row = {
                description: orderProduct?.inventory?.product?.description,
                material_description: orderProduct?.inventory?.product?.material_description,
                amount: orderProduct.quantity,
                price: orderProduct.sale_price,
                total: orderProduct.revenues,
                inventories_id: orderProduct.inventories_id,
                url_complete: orderProduct?.inventory?.product?.url_complete,
                stock: orderProduct.inventory.quantity,
                startingAmount: orderProduct.quantity,
                unit_symbol: orderProduct?.inventory?.unit_measurement?.symbol
            };

            this._products.push(row);
        });

        this._totals.push({
            _total: products.length > 0 ? products[0].total_revenues : 0.00,
            _totalQuantity: products.length > 0 ? products[0].total_quantity : 0.00
        });

        this.productIds = this._products.map((item) => item.inventories_id);

        this.branchOfficesId = this.order.branch_offices_id;
    }

    setValidators() {
    }

    getAllCustomers(event) {
        this._loadingCustomer = true;
        const params = {
            search: encodeURIComponent(event.term)
        }
        this._store.dispatch(customersActions.getAllCustomersBySearch({ params: params }));
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

        if (this._branchOffices != undefined) {
            this.branchOfficesId = this._branchOffices.id;
        }
    }

    onSaveFile(event) {
        if (!event.target.files[0]) {
            return;
        }
        const inpF = event.target as HTMLInputElement;

        if ((inpF.files[0] as any)) {
            const input = event.target;
            const file = input.files[0];
            const fileName = (inpF.files[0] as any).name;

            const sizeByte = file.size * 1;
            const result = sizeByte / 1024;
            const sizeKiloByte = parseInt(result + '', 10);

            if (sizeKiloByte > 1024) {
                Swal.fire(this._messageService.BuildError('El tamaño supera el máximo requerido que es de 1MB', 'Oops...')).then(() => {
                });
                return;
            }

            const params = {
                model: 'Order',
                file: file,
                filename: fileName
            };
            this._store.dispatch(generalActions.fileUpload({ params: params }));
        }
    }

    onSaveFileMultiple(event) {

        if (event.target.files.length == 0) {
            return;
        }

        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (files && files.length > 2) {
            Swal.fire(this._messageService.BuildError('Solo puedes subir un máximo de dos archivos', 'Oops...')).then(() => {
            });
            input.value = "";
            return;
        }

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const fileName = file.name;

            const sizeByte = file.size * 1;
            const result = sizeByte / 1024;
            const sizeKiloByte = parseInt(result + '', 10);

            if (sizeKiloByte > 1024) {
                Swal.fire(this._messageService.BuildError('El tamaño supera el máximo requerido que es de 1MB', 'Oops...')).then(() => {
                });
                return;
            }

            data.append(`files[${i}]`, file);
        }

        data.append("model", 'Order');
        data.append("folio", '0');
        data.append('_method', 'POST')

        this._store.dispatch(generalActions.fileUploadMultiple({ params: data }));
    }

    activatingFile(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    onResetFile() {
        this.image = '';
        this.files = [];
        this.urls = [];
        this.urlsComplete = [];
        this._progress = 0;
        this._uploadError = false;
    }

    addItem(newEven: boolean) {
        this.quantityExcessProduct = newEven;
    }
}
