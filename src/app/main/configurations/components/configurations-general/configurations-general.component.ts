import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpEventType} from '@angular/common/http';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import Swal from 'sweetalert2';

import {AppState} from '../../../common/redux/general.reducers';
import * as generalActions from '../../../common/redux/general.actions';
import {MessageService} from '../../../common/services/message.service';
import {FiscalRegimenModel} from '../../../common/models/fiscal-regimen.model';
import {CountryModel} from '../../../common/models/country.model';
import {PostalCodeModel} from '../../../common/models/postal-code.model';
import {CologneModel} from '../../../common/models/cologne.model';
import {LocationModel} from '../../../common/models/location.model';
import {MunicipalityModel} from '../../../common/models/municipality.model';
import {StateCountryModel} from '../../../common/models/state-country.model';
import {ConfigurationModel} from '../../models/configuration.model';
import * as configurationsActions from '../../redux/configurations.actions';

@Component({
    selector: 'app-configurations-general',
    templateUrl: './configurations-general.component.html',
    styleUrls: ['./configurations-general.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsGeneralComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() _button_show;
    configuration: ConfigurationModel;

    photo: string = '';
    _url_photo: string = '';
    _progress = 0;
    _uploadError = false;
    _barStatus: string;

    _configurationGeneralForm: FormGroup;
    _submittedGeneral = false;
    _area = 0;
    _fiscal_regimens: FiscalRegimenModel[];

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
                private _messageService: MessageService) {
        this.getConfiguration();
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.controls.country.setValue(1);
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onSaveAvatar(event) {
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
                model: 'Configuration',
                file: file,
                filename: fileName
            };
            this._store.dispatch(generalActions.fileUpload({params: params}));
        }
    }

    onResetAvatar() {
        this._configurationGeneralForm.controls.temporaryFile_id.setValue(null);
        this._url_photo = '';
        setTimeout(() => {
            this.photo = this.configuration.photo;
        }, 10);
    }

    onChangePostalCode(event) {
        if (event.length === 5) {
            const params = {
                postal_code: event
            };
            this._store.dispatch(generalActions.getUbications({params: params}));
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

    onSaveConfigurationGeneral() {
        this._submittedGeneral = true;
        if (this._configurationGeneralForm.invalid) {
            return;
        }

        const configuration = {
            'trade_name': this._configurationGeneralForm.get('trade_name').value,
            'reason_social': this._configurationGeneralForm.get('reason_social').value,
            'rfc': this._configurationGeneralForm.get('rfc').value,
            'email': this._configurationGeneralForm.get('email').value,
            'cellphone': this._configurationGeneralForm.get('cellphone').value,
            'website': this._configurationGeneralForm.get('website').value,
            'street': this._configurationGeneralForm.get('street').value,
            'exterior_number': this._configurationGeneralForm.get('exterior_number').value,
            'interior_number': this._configurationGeneralForm.get('interior_number').value,
            'fiscal_regimen_id': this._configurationGeneralForm.get('fiscal_regimen').value,
            'cologne_id': this._configurationGeneralForm.get('cologne').value,
            'location_id': this._configurationGeneralForm.get('location').value,
            'municipality_id': this._configurationGeneralForm.get('municipality').value,
            'state_country_id': this._configurationGeneralForm.get('state_country').value,
            'country_id': this._configurationGeneralForm.get('country').value,
            'postal_code_id': this._postal_code.id,
            'temporary_file_id': this._configurationGeneralForm.controls.temporaryFile_id.value
        };

        this._store.dispatch(configurationsActions.updateConfiguration({params: configuration}));
    }

    onCleanConfigurationGeneralForm() {
        this.setValueGeneralConfiguration();

        setTimeout(() => {
            this._submittedGeneral = false;
        }, 10);
    }

    get controls() {
        return this._configurationGeneralForm.controls;
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._fiscal_regimens = state.auth.fiscal_regimens;
                this._states_countries_original = state.auth.states_countries;
                this._countries = state.auth.countries;

                if (state.configurations.configuration) {
                    this.configuration = state.configurations.configuration;
                    this.photo = this.configuration.photo;
                }
            }
        }));

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
                            this._configurationGeneralForm.controls.temporaryFile_id.setValue(response.data.body.data.id);
                            this._url_photo = response.data.body.data.url_complete;
                            this.photo = response.data.body.data.url_complete;
                            setTimeout(() => this._barStatus = null, 1000);
                            return;
                    }
                })
        );

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
                        const componentLocation = this._configurationGeneralForm.get('location');
                        if(this._locations.length > 0) {
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

                        if (this.configuration && this.configuration.postal_code.code === this._postal_code.code) {
                            this.controls.cologne.setValue(this.configuration.cologne.id);
                            if (this.configuration.location) {
                                this.controls.location.setValue(this.configuration.location.id);
                            }
                            this.controls.municipality.setValue(this.configuration.municipality.id);
                            this.controls.state_country.setValue(this.configuration.state_country.id);
                        }
                        if (this._url_photo !== '') {
                            this.photo = this._url_photo;
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
                .pipe(ofType(configurationsActions.getConfigurationComplete))
                .subscribe(response => {
                    this.configuration = response.data.data;
                    if (this.configuration) {
                        this.setValueGeneralConfiguration();
                    }
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(configurationsActions.updateConfigurationComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    this.photo = response.data.data.photo;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );
    }

    initializeForm() {
        this._configurationGeneralForm = new FormGroup({
            'trade_name': new FormControl('', Validators.required),
            'reason_social': new FormControl('', Validators.required),
            'rfc': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'cellphone': new FormControl('', Validators.required),
            'website': new FormControl('', Validators.required),
            'fiscal_regimen': new FormControl('', Validators.required),
            'street': new FormControl('', Validators.required),
            'exterior_number': new FormControl('', Validators.required),
            'interior_number': new FormControl(''),
            'cologne': new FormControl({value: '', disabled: true}, Validators.required),
            'location': new FormControl({value: '', disabled: true}),
            'municipality': new FormControl({value: '', disabled: true}, Validators.required),
            'postal_code': new FormControl('', Validators.required),
            'state_country': new FormControl({value: '', disabled: true}, Validators.required),
            'country': new FormControl({value: '', disabled: true}, Validators.required),
            'temporaryFile_id': new FormControl(null)
        });
    }

    getConfiguration() {
        this._store.dispatch(configurationsActions.getConfiguration());
    }

    setValueGeneralConfiguration() {
        this._configurationGeneralForm.patchValue({
            trade_name: this.configuration.trade_name,
            reason_social: this.configuration.reason_social,
            rfc: this.configuration.rfc,
            email: this.configuration.email,
            cellphone: this.configuration.cellphone,
            website: this.configuration.website,
            fiscal_regimen: this.configuration.fiscal_regimen.id,
            street: this.configuration.street,
            exterior_number: this.configuration.exterior_number,
            interior_number: this.configuration.interior_number,
            temporaryFile_id: null
        })
        this.photo = this.configuration.photo;
        this.controls.postal_code.setValue(String(this.configuration.postal_code.code));
    }

    activatingFile(event) {
        event.stopPropagation();
        const thisE = event.target as HTMLButtonElement;
        const thisF = thisE.closest('div').querySelector('input') as HTMLInputElement;
        thisF.click();
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
