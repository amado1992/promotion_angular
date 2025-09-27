import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { CustomerModel } from '../../models/customer.model';
import { CountryModel } from '../../../common/models/country.model';
import { StateCountryModel } from '../../../common/models/state-country.model';
import { PaymentFormatModel } from '../../../common/models/payment-format.model';
import { PaymentMethodModel } from '../../../common/models/payment-method.model';
import { FiscalRegimenModel } from '../../../common/models/fiscal-regimen.model';
import { AppState } from '../../../common/redux/general.reducers';
import * as customersActions from '../../redux/customers.actions';
import { MessageService } from '../../../common/services/message.service';
import { UseCFDIModel } from '../../../common/models/use-cfdi.model';
import { PostalCodeModel } from '../../../common/models/postal-code.model';
import { CologneModel } from '../../../common/models/cologne.model';
import { LocationModel } from '../../../common/models/location.model';
import { MunicipalityModel } from '../../../common/models/municipality.model';
import * as generalActions from '../../../common/redux/general.actions';

@Component({
    selector: 'app-customers-update',
    templateUrl: './customers-update.component.html',
    styleUrls: ['./customers-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomersUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    customer: CustomerModel;
    _updateCustomerForm: FormGroup;
    _submitted = false;
    _area = 0;
    _payment_methods: PaymentMethodModel[];
    _payment_format_read_only = true;
    _payment_formats: PaymentFormatModel[];
    _filter_payment_formats: PaymentFormatModel[];
    _fiscal_regimens: FiscalRegimenModel[];
    _use_cfdis: UseCFDIModel[];

    _rfc_generic = false;
    _postal_code: PostalCodeModel;
    _colognes: CologneModel[];
    _locations: LocationModel[];
    _municipalities: MunicipalityModel[];
    _states_countries_original: StateCountryModel[];
    _states_countries: StateCountryModel[];
    _countries: CountryModel[];
    _search = false;

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
        private _actions$: Actions,
        private _router: Router,
        private _messageService: MessageService) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.customer.payment_term) {
                this.controls.payment_term.setValue(this.customer.payment_term);
            }
            if (this.customer.payment_method) {
                this.onChangePaymentMethod(this.customer.payment_method.id);
                this.controls.payment_method.setValue(this.customer.payment_method.id);

                if (this.customer.payment_format) {
                    this.controls.payment_format.setValue(this.customer.payment_format.id);
                }
            }
            this.controls.postal_code.setValue(String(this.customer.postal_code.code));
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onChangeRFC(event) {
        /*if (event === 'XAXX010101000') {
            this._rfc_generic = true;
            this._updateCustomerForm.get('fiscal_regimen').setValue(12);
            this._updateCustomerForm.get('use_cfdi').setValue(22);
            this._updateCustomerForm.get('postal_code').setValue('15820');
            this.onChangePostalCode('15820');
            this._updateCustomerForm.get('payment_method').setValue(1);
            this.onChangePaymentMethod(1);
            this._updateCustomerForm.get('payment_format').setValue(1);

            this.controls.fiscal_regimen.disable();
            this.controls.use_cfdi.disable();
            this.controls.payment_method.disable();
            this.controls.payment_format.disable();
        } else {
            this._rfc_generic = false;

            this.controls.fiscal_regimen.enable();
            this.controls.use_cfdi.enable();
            this.controls.payment_method.enable();
            this.controls.payment_format.enable();
        }*/

        this._rfc_generic = false;

        this.controls.fiscal_regimen.enable();
        this.controls.use_cfdi.enable();
        this.controls.payment_method.enable();
        this.controls.payment_format.enable();
    }

    onChangePostalCode(event) {
        if (event.length === 5) {
            const params = {
                postal_code: event
            };
            this._store.dispatch(generalActions.getUbications({ params: params }));
        } else if (this._search) {
            this.resetComponents();
        }
    }

    onChangeCountry(country_id) {
        this._area = 0;
        for (const country of this._countries) {
            if (+country_id === country.id) {
                this._area = country.phone_code;
                break;
            }
        }
    }

    onChangePaymentMethod(event) {
        if (event) {
            let methodPayment = this._payment_methods.find(method_payment => method_payment.id === event);
            if (methodPayment.key_sat === 'PUE') {
                this._filter_payment_formats = this._payment_formats.filter(payment_format => payment_format.key_sat !== '99');
                this._updateCustomerForm.get('payment_format').setValue(null);
            } else if (methodPayment.key_sat === 'PPD') {
                this._filter_payment_formats = this._payment_formats.filter(payment_format => payment_format.key_sat === '99');
                this._updateCustomerForm.get('payment_format').setValue(this._filter_payment_formats[0].id);
            }
            this._payment_format_read_only = false;
        } else {
            this._updateCustomerForm.get('payment_format').setValue(null);
            this._filter_payment_formats = [];
            this._payment_format_read_only = true;
        }
    }

    onUpdate(): void {
        this._submitted = true;
        if (this._updateCustomerForm.invalid) {
            return;
        }

        const customerUpdate = {
            'id': this._updateCustomerForm.get('id').value,
            'reason_social': this._updateCustomerForm.get('reason_social').value,
            'rfc': this._updateCustomerForm.get('rfc').value,
            'email': this._updateCustomerForm.get('email').value,
            'cellphone': this._updateCustomerForm.get('cellphone').value,
            'phone': this._updateCustomerForm.get('phone').value,
            'street': this._updateCustomerForm.get('street').value,
            'exterior_number': this._updateCustomerForm.get('exterior_number').value,
            'interior_number': this._updateCustomerForm.get('interior_number').value,
            'payment_term': this._updateCustomerForm.get('payment_term').value,
            'contact_name': this._updateCustomerForm.get('contact_name').value,
            'contact_email': this._updateCustomerForm.get('contact_email').value,
            'contact_phone': this._updateCustomerForm.get('contact_phone').value,
            'fiscal_regimen_id': this._updateCustomerForm.get('fiscal_regimen').value,
            'use_cfdi_id': this._updateCustomerForm.get('use_cfdi').value,
            'payment_method_id': this._updateCustomerForm.get('payment_method').value,
            'payment_format_id': this._updateCustomerForm.get('payment_format').value,
            'cologne_id': this._updateCustomerForm.get('cologne').value,
            'location_id': this._updateCustomerForm.get('location').value,
            'municipality_id': this._updateCustomerForm.get('municipality').value,
            'state_country_id': this._updateCustomerForm.get('state_country').value,
            'country_id': this._updateCustomerForm.get('country').value,
            'postal_code_id': this._postal_code.id
        };

        this._store.dispatch(customersActions.updateCustomer({ params: customerUpdate }));
    }

    onClose(): void {
        this._router.navigate(['/customers/index']).then();
    }

    get controls() {
        return this._updateCustomerForm.controls;
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._payment_formats = state.auth.payment_formats;
                this._payment_methods = state.auth.payment_methods;
                this._fiscal_regimens = state.auth.fiscal_regimens;
                this._use_cfdis = state.auth.use_cfdis;
                this._states_countries_original = state.auth.states_countries;
                this._countries = state.auth.countries;
                this.customer = state.customers.customer;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(generalActions.getUbicationsComplete))
                .subscribe(response => {
                    if (response.data.success) {
                        this._search = true;
                        this._postal_code = response.data.data.postal_code;
                        this._colognes = response.data.data.colognes;
                        this.controls.cologne.enable();
                        if (this._colognes.length === 1) {
                            this.controls.cologne.setValue(this._colognes[0].id);
                        }
                        this._locations = response.data.data.locations;
                        this.controls.location.enable();
                        if (this._locations.length === 1) {
                            this.controls.location.setValue(this._locations[0].id);
                        }
                        const componentLocation = this._updateCustomerForm.get('location');
                        if (this._locations.length > 0) {
                            componentLocation.setValidators([Validators.required]);
                            componentLocation.updateValueAndValidity();
                        } else {
                            componentLocation.setValidators(null);
                            componentLocation.updateValueAndValidity();
                        }
                        this._municipalities = response.data.data.municipalities;
                        this.controls.municipality.enable();
                        if (this._municipalities.length === 1) {
                            this.controls.municipality.setValue(this._municipalities[0].id);
                        }
                        const code = this._postal_code.state_code;
                        const states_countries = this._states_countries_original.filter(function (state) {
                            return state.code === code;
                        });
                        this._states_countries = states_countries;
                        this.controls.state_country.setValue(states_countries[0].id);
                        this.controls.state_country.enable();
                        this.controls.country.setValue(1);
                        this.controls.country.enable();

                        if (this.customer && this.customer.postal_code.code === this._postal_code.code) {
                            this.controls.cologne.setValue(this.customer.cologne?.id);
                            if (this.customer.location) {
                                this.controls.location.setValue(this.customer.location.id);
                            }
                            this.controls.municipality.setValue(this.customer.municipality?.id);
                            this.controls.state_country.setValue(this.customer.state_country?.id);
                        }
                    } else {
                        this._search = false;
                        this.resetComponents();
                        this.controls.postal_code.setValue('');
                        const messageAlert = this.convertErrorsToString(response.data.errors);
                        Swal.fire(this._messageService.BuildError(messageAlert)).then(() => {
                        });
                    }
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(customersActions.updateCustomerComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    setTimeout(() => {
                        this._router.navigate(['customers/index']).then();
                    }, 300);
                })
        );
    }

    initializeForm() {
        this._updateCustomerForm = new FormGroup({
            'id': new FormControl(this.customer.id, Validators.required),
            'reason_social': new FormControl(this.customer.reason_social, Validators.required),
            'rfc': new FormControl(this.customer.rfc, Validators.required),
            'fiscal_regimen': new FormControl(this.customer.fiscal_regimen?.id, Validators.required),
            'use_cfdi': new FormControl(this.customer.use_cfdi?.id, Validators.required),
            'email': new FormControl(this.customer.email, Validators.email),
            'cellphone': new FormControl(this.customer.cellphone),
            'phone': new FormControl(this.customer.phone),
            'street': new FormControl(this.customer.street),
            'exterior_number': new FormControl(this.customer.exterior_number),
            'interior_number': new FormControl(this.customer.interior_number),
            'cologne': new FormControl({ value: '', disabled: true }, Validators.required),
            'location': new FormControl({ value: '', disabled: true }),
            'municipality': new FormControl({ value: '', disabled: true }, Validators.required),
            'postal_code': new FormControl('', Validators.required),
            'state_country': new FormControl({ value: '', disabled: true }, Validators.required),
            'country': new FormControl({ value: '', disabled: true }, Validators.required),
            'payment_term': new FormControl(''),
            'payment_method': new FormControl(''),
            'payment_format': new FormControl(''),
            'contact_name': new FormControl(this.customer.contact_name),
            'contact_email': new FormControl(this.customer.contact_email, Validators.email),
            'contact_phone': new FormControl(this.customer.contact_phone)
        });
    }

    resetComponents() {
        this._colognes = this._locations = this._municipalities = [];
        this._states_countries = this._states_countries_original;
        this.controls.cologne.setValue('');
        this.controls.cologne.disable();
        this.controls.location.setValue('');
        this.controls.location.disable();
        this.controls.municipality.setValue('');
        this.controls.municipality.disable();
        this.controls.state_country.setValue('');
        this.controls.state_country.disable();
        this.controls.country.setValue('');
        this.controls.country.disable();
    }

    convertErrorsToString(errors) {
        let newError = '';
        for (const key in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, key)) {
                newError += errors[key] + '<br>';
            }
        }
        return newError.substring(0, newError.length - 4).toUpperCase();
    }
}
