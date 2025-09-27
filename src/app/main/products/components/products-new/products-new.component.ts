import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as productsActions from '../../redux/products.actions';
import { AppState } from '../../../common/redux/general.reducers';
import { SimpleModel } from '../../../common/models/simple.model';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MessageService } from 'app/main/common/services/message.service';
import * as generalActions from 'app/main/common/redux/general.actions';

@Component({
    selector: 'app-products-new',
    templateUrl: './products-new.component.html',
    styleUrls: ['./products-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductsNewComponent implements OnInit, OnDestroy {

    _addNewProductForm: FormGroup;
    _categories: SimpleModel[];
    _brands: SimpleModel[];
    _submitted = false;

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
        private _messageService: MessageService) {
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
        let price = this._addNewProductForm.get(action).value;
        if (price === '') {
            price = 0;
        }
        this._addNewProductForm.get(action).setValue(parseFloat(price).toFixed(2));
    }

    onCreate(): void {
        this._submitted = true;
        if (this._addNewProductForm.invalid) {
            return;
        }

        const product = {
            'description': this._addNewProductForm.get('product_description').value,
            'categorys_id': this._addNewProductForm.get('product_category').value,
            'name': this._addNewProductForm.get('name').value,
            'material_description': this._addNewProductForm.get('material_description').value,
            'brands_id': this._addNewProductForm.get('brand').value,
            'url_image': this.image
        };

        this._store.dispatch(productsActions.addNewProduct({ params: product }));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._addNewProductForm.controls;
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
                .pipe(ofType(productsActions.addNewProductComplete))
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
        this._addNewProductForm = new FormGroup({
            'name': new FormControl('', Validators.required),
            'product_description': new FormControl(''),
            'material_description': new FormControl(''),
            'product_category': new FormControl('', Validators.required),
            'brand': new FormControl('')
        });
    }

    onChangeCategory(event) {

    }

    onChangeBrand(event) {

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
        this.imageComplete = '';
        this.urls = [];
        this._progress = 0;
        this._uploadError = false;
    }
}
