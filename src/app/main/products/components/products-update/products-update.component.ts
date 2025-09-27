import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../common/redux/general.reducers';
import { ProductModel } from '../../models/product.model';
import * as productsActions from '../../redux/products.actions';
import { SimpleModel } from '../../../common/models/simple.model';
import { UnitMeasurementModel } from '../../../common/models/unit-measurement.model';
import { TemporaryFileDto } from 'app/main/orders/models/orders.model';
import Swal from 'sweetalert2';
import { MessageService } from 'app/main/common/services/message.service';
import * as generalActions from 'app/main/common/redux/general.actions';
import { HttpEventType } from '@angular/common/http';
import { DateFormatPipe } from 'app/main/common/pipes/dateFormat/date-format.pipe';

@Component({
    selector: 'app-products-update',
    templateUrl: './products-update.component.html',
    styleUrls: ['./products-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductsUpdateComponent implements OnInit, OnDestroy {

    @Input() product: ProductModel;
    _updateProductForm: FormGroup;
    _unit_measurements: UnitMeasurementModel[];
    _categories: SimpleModel[];
    _brands: SimpleModel[];
    _submitted = false;
    _loadingCatalog = false;

    private _subscription = new Subscription();

    image: string = '';
    imageComplete: string = '';
    urls: any[] = [];
    _progress = 0;
    _uploadError = false;
    _barStatus: string;

    constructor(public _activeModal: NgbActiveModal,
        private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,
        private _dateFormatPipe: DateFormatPipe) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onBlurPrice(action) {
        let price = this._updateProductForm.get(action).value;
        if (price === '') {
            price = 0;
        }
        this._updateProductForm.get(action).setValue(parseFloat(price).toFixed(2));
    }

    onUpdate(): void {
        this._submitted = true;
        if (this._updateProductForm.invalid) {
            return;
        }

        const product = {
            'id': this._updateProductForm.get('id').value,
            'description': this._updateProductForm.get('product_description').value,
            'categorys_id': this._updateProductForm.get('product_category').value,
            'name': this._updateProductForm.get('name').value,
            'material_description': this._updateProductForm.get('material_description').value,
            'brands_id': this._updateProductForm.get('brand').value,
            'url_image': this.image
        };

        this._store.dispatch(productsActions.updateProduct({ params: product }));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._updateProductForm.controls;
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._categories = state.auth.product_categories;
                this._brands = state.auth.brands;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.updateProductComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(generalActions.fileUploadComplete))
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

                            this.image = response.data.body.data.url;
                            this.imageComplete = response.data.body.data.url_complete;

                            setTimeout(() => this._barStatus = null, 1000);
                            return;
                    }
                })
        );
    }

    initializeForm(): void {

        this._updateProductForm = new FormGroup({
            'id': new FormControl(this.product.id, Validators.required),
            'product_description': new FormControl(this.product.description),
            'product_category': new FormControl(this.product.categorys_id, Validators.required),
            'name': new FormControl(this.product.name, Validators.required),
            'material_description': new FormControl(this.product.material_description),
            'brand': new FormControl(this.product.brands_id)
        });

        this.image = this.product.url_image;
        this.imageComplete = this.product.url_complete;
    }

    onChangeCategory(event) {

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
                model: 'Product',
                file: file,
                filename: fileName
            };

            this._store.dispatch(generalActions.fileUpload({ params: params }));
        }
    }

    activatingFile(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    onResetFile() {
        this.image = '';
        this.imageComplete = ''
        this.urls = [];
        this._progress = 0;
        this._uploadError = false;
    }

    onChangeBrand(event) {

    }
}
