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
import * as ordersActions from '../../redux/orders.actions';
import { UseCFDIModel } from '../../../common/models/use-cfdi.model';
import { CustomerModel } from '../../../customers/models/customer.model';
import { MessageService } from '../../../common/services/message.service';
import * as customersActions from '../../../customers/redux/customers.actions';
import * as productsActions from '../../../products/redux/products.actions';
import { repeaterAnimation } from '../../../common/animations/form-repeater.animation';
import * as branchofficesActions from '../../../branch-offices/redux/branch-offices.actions';
import { BranchOfficeModel } from 'app/main/branch-offices/models/branch-office.model';
import { OrderModel, TemporaryFileDto } from '../../models/orders.model';
import { CustomersNewComponent } from 'app/main/customers/components/customers-new/customers-new.component';
import * as generalActions from 'app/main/common/redux/general.actions';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-orders-new',
    templateUrl: './orders-new.component.html',
    styleUrls: ['./orders-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [repeaterAnimation]
})
export class OrdersNewComponent implements OnInit, AfterViewInit, OnDestroy {

    _addNewOrderForm: FormGroup;
    _submitted = false;

    _use_cfdis: UseCFDIModel[];

    _loadingCustomer = false;
    _customers: CustomerModel[];
    _customer: CustomerModel;

    public orders: any[] = [];

    _products: any[] = [];
    _totals: any[] = [];

    _loadingBranchOffices: boolean;
    _branchsOffices: BranchOfficeModel[] = [];
    _branchOffices: BranchOfficeModel;

    private _subscription = new Subscription();

    order: OrderModel

    sex =
        [{ id: 'MASCULINO', name: 'Masculino' },
        { id: 'FEMENINO', name: 'Femenino' },
        ];

    image: string = '';
    files: TemporaryFileDto[] = [];
    urls: any[] = [];
    urlsComplete: any[] = [];
    _progress = 0;
    _uploadError = false;
    _barStatus: string;

    customer: CustomerModel = new CustomerModel();

    _area: number = 52;
    productIds: number[] = [];

    quantityExcessProduct: boolean = false;
    branchOfficesId: any = 0;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,
        private _router: Router,
        private _modalService: NgbModal) {
        this.getAllCustomers = debounce(this.getAllCustomers, 500);

        this.getBranchOffices()

    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit() {
        setTimeout(() => {

            if (this._branchsOffices.length > 0) {
                this._addNewOrderForm.get('branchOfficesId').setValue(this._branchsOffices[0].id);
                this.branchOfficesId = this._branchsOffices[0].id;
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

    onChangeCustomer(event) {
        if (!event) {
            this._customer = null;
            this._addNewOrderForm.get('address').setValue('');
            this._addNewOrderForm.get('phone').setValue('');
            this._addNewOrderForm.get('cellphone').setValue('');
            this._addNewOrderForm.get('customer_email').setValue('');
            return;
        }
        this._customer = this._customers.find(function (customer) {
            return customer.id === event;
        });

        this._addNewOrderForm.get('cellphone').setValue(this._customer.cellphone);
        this._addNewOrderForm.get('customer_email').setValue(this._customer.email);
        this._addNewOrderForm.get('phone').setValue(this._customer.phone);
        this._addNewOrderForm.get('address').setValue(this._customer.inline_address);
    }

    onCreate() {
        this._submitted = true;

        if (this._addNewOrderForm.invalid) {
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
            Swal.fire(this._messageService.BuildError('Seleccione un producto'));
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

        const urls = this.urls.join(',');

        this.order = new OrderModel();
        this.order.id = 0;
        this.order.customer_id = this._addNewOrderForm.get('customer_reason_social').value;
        this.order.branch_offices_id = this._addNewOrderForm.get('branchOfficesId').value;
        this.order.products = this._products;
        this.order.total_revenues = this._totals.length > 0 ? this._totals[0]['_total'] : 0.00;
        this.order.url_file = urls;
        this.order.total_quantity = this._totals.length > 0 ? this._totals[0]['_totalQuantity'] : 0.00;
        this.order.observation = this._addNewOrderForm.get('observation').value;

        this._store.dispatch(ordersActions.addNewOrder({ params: this.order }));
    }

    onClose() {
        this._router.navigate(['/orders/index']).then();
    }

    get controls() {
        return this._addNewOrderForm.controls;
    }

    listeningActions() {
        this._subscription.add(
            this._store.subscribe((state) => {
                if (state.auth.auth) {
                    this._use_cfdis = state.auth.use_cfdis;
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
                .pipe(ofType(customersActions.getAllCustomersBySearchComplete))
                .subscribe(response => {
                    this._customers = response.data.data;
                    this._loadingCustomer = false;

                    if (this.customer.id) {
                        this.onChangeCustomer(this.customer.id)
                    }
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.addNewOrderComplete))
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
                .pipe(ofType(customersActions.addNewCustomerComplete))
                .subscribe(response => {
                    this.customer = response.data.data;
                    this._addNewOrderForm.get('customer_reason_social').setValue(this.customer.id);
                    this.getAllCustomersAfterNewClient(this.customer.reason_social)
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
                                this.urls.push(this.files[i].url)
                                this.urlsComplete.push(this.files[i].url_complete)
                            }

                            setTimeout(() => this._barStatus = null, 1000);
                            return;
                    }
                })
        );
    }

    initializeForm(): void {
        this._addNewOrderForm = new FormGroup({
            'customer_reason_social': new FormControl('', Validators.required),
            'customer_email': new FormControl(''),
            'cellphone': new FormControl(''),
            'phone': new FormControl(''),
            'address': new FormControl(''),
            'branchOfficesId': new FormControl(null, Validators.required),
            'observation': new FormControl('')
        });

        this._totals.push({
            _total: 0.00
        });

        this.branchOfficesId = this._addNewOrderForm.get('branchOfficesId').value;
    }

    getAllCustomers(event) {
        this._loadingCustomer = true;
        const params = {
            search: encodeURIComponent(event.term)
        }
        this._store.dispatch(customersActions.getAllCustomersBySearch({ params: params }));
    }

    getAllCustomersAfterNewClient(event) {
        this._loadingCustomer = true;
        const params = {
            search: event
        }
        this._store.dispatch(customersActions.getAllCustomersBySearch({ params: params }));
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

    onModalNewcCustomerOpen() {
        this._modalService.open(CustomersNewComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
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
