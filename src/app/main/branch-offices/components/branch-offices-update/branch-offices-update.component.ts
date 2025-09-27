import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import Swal from 'sweetalert2';

import * as branchOfficesActions from '../../redux/branch-offices.actions';
import {BranchOfficeModel} from '../../models/branch-office.model';
import {CountryModel} from '../../../common/models/country.model';
import {StateCountryModel} from '../../../common/models/state-country.model';
import {AppState} from '../../../common/redux/general.reducers';
import {PostalCodeModel} from '../../../common/models/postal-code.model';
import {CologneModel} from '../../../common/models/cologne.model';
import {LocationModel} from '../../../common/models/location.model';
import {MunicipalityModel} from '../../../common/models/municipality.model';
import * as generalActions from '../../../common/redux/general.actions';
import {MessageService} from '../../../common/services/message.service';

@Component({
    selector: 'app-branch-offices-update',
    templateUrl: './branch-offices-update.component.html',
    styleUrls: ['./branch-offices-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BranchOfficesUpdateComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() branchOffice: BranchOfficeModel;
    _updateBranchOfficeForm: FormGroup;
    _submitted = false;
    _area = 0;

    _postal_code: PostalCodeModel;
    _colognes: CologneModel[];
    _locations: LocationModel[];
    _municipalities: MunicipalityModel[];
    _states_countries_original: StateCountryModel[];
    _states_countries: StateCountryModel[];
    _countries: CountryModel[];
    _search = false;

    private _subscription = new Subscription();

    constructor(public _activeModal: NgbActiveModal,
                private _store: Store<AppState>,
                private _actions$: Actions,
                private _messageService: MessageService) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.controls.branch_office_country.setValue(1);
            this.controls.branch_office_postal_code.setValue(String(this.branchOffice.postal_code.code));
        }, 0);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
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

    onUpdate() {
        this._submitted = true;
        if (this._updateBranchOfficeForm.invalid) {
            return;
        }

        const branchOfficeUpdate = {
            'id': this._updateBranchOfficeForm.get('id').value,
            'name': this._updateBranchOfficeForm.get('branch_office_name').value,
            'serial': this._updateBranchOfficeForm.get('branch_office_serial').value,
            'email': this._updateBranchOfficeForm.get('branch_office_email').value,
            'phone': this._updateBranchOfficeForm.get('branch_office_phone').value,
            'whatsapp': this._updateBranchOfficeForm.get('branch_office_whatsapp').value,
            'street': this._updateBranchOfficeForm.get('branch_office_street').value,
            'exterior_number': this._updateBranchOfficeForm.get('branch_office_exterior_number').value,
            'interior_number': this._updateBranchOfficeForm.get('branch_office_interior_number').value,
            'cologne_id': this._updateBranchOfficeForm.get('branch_office_cologne').value,
            'location_id': this._updateBranchOfficeForm.get('branch_office_location').value,
            'municipality_id': this._updateBranchOfficeForm.get('branch_office_municipality').value,
            'state_country_id': this._updateBranchOfficeForm.get('branch_office_state_country').value,
            'country_id': this._updateBranchOfficeForm.get('branch_office_country').value,
            'postal_code_id': this._postal_code.id
        };

        this._store.dispatch(branchOfficesActions.updateBranchOffice({params: branchOfficeUpdate}));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._updateBranchOfficeForm.controls;
    }

    listeningActions() {
        this._subscription.add(this._store.subscribe((state) => {
            if (state.auth.auth) {
                this._states_countries_original = state.auth.states_countries;
                this._countries = state.auth.countries;
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
                        this.controls.branch_office_cologne.enable();
                        if (this._colognes.length === 1) {
                            this.controls.branch_office_cologne.setValue(this._colognes[0].id);
                        }
                        this._locations = response.data.data.locations;
                        this.controls.branch_office_location.enable();
                        if (this._locations.length === 1) {
                            this.controls.branch_office_location.setValue(this._locations[0].id);
                        }
                        this._municipalities = response.data.data.municipalities;
                        this.controls.branch_office_municipality.enable();
                        if (this._municipalities.length === 1) {
                            this.controls.branch_office_municipality.setValue(this._municipalities[0].id);
                        }
                        const componentLocation = this._updateBranchOfficeForm.get('branch_office_location');
                        if(this._locations.length > 0) {
                            componentLocation.setValidators([Validators.required]);
                            componentLocation.updateValueAndValidity();
                        } else {
                            componentLocation.setValidators(null);
                            componentLocation.updateValueAndValidity();
                        }
                        const code = this._postal_code.state_code;
                        const states_countries = this._states_countries_original.filter(function (state) {
                            return state.code === code;
                        });
                        this._states_countries = states_countries;
                        this.controls.branch_office_state_country.setValue(states_countries[0].id);
                        this.controls.branch_office_state_country.enable();
                        this.controls.branch_office_country.setValue(1);
                        this.controls.branch_office_country.enable();

                        if (this.branchOffice && this.branchOffice.postal_code.code === this._postal_code.code) {
                            this.controls.branch_office_cologne.setValue(this.branchOffice.cologne.id);
                            if (this.branchOffice.location) {
                                this.controls.branch_office_location.setValue(this.branchOffice.location.id);
                            }
                            this.controls.branch_office_municipality.setValue(this.branchOffice.municipality.id);
                            this.controls.branch_office_state_country.setValue(this.branchOffice.state_country.id);
                        }
                    } else {
                        this._search = false;
                        this.resetComponents();
                        this.controls.branch_office_postal_code.setValue('');
                        const messageAlert = this.convertErrorsToString(response.data.errors);
                        Swal.fire(this._messageService.BuildError(messageAlert)).then(() => {
                        });
                    }
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(branchOfficesActions.updateBranchOfficeComplete))
                .subscribe(response => {
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._updateBranchOfficeForm = new FormGroup({
            'id': new FormControl(this.branchOffice.id, Validators.required),
            'branch_office_name': new FormControl(this.branchOffice.name, Validators.required),
            'branch_office_serial': new FormControl(this.branchOffice.serial, Validators.required),
            'branch_office_email': new FormControl(this.branchOffice.email, [Validators.required, Validators.email]),
            'branch_office_phone': new FormControl(this.branchOffice.phone, Validators.required),
            'branch_office_whatsapp': new FormControl(this.branchOffice.whatsapp, Validators.required),
            'branch_office_street': new FormControl(this.branchOffice.street),
            'branch_office_exterior_number': new FormControl(this.branchOffice.exterior_number),
            'branch_office_interior_number': new FormControl(this.branchOffice.interior_number),
            'branch_office_cologne': new FormControl({value: '', disabled: true}, Validators.required),
            'branch_office_location': new FormControl({value: '', disabled: true}),
            'branch_office_municipality': new FormControl({value: '', disabled: true}, Validators.required),
            'branch_office_postal_code': new FormControl('', Validators.required),
            'branch_office_state_country': new FormControl({value: '', disabled: true}, Validators.required),
            'branch_office_country': new FormControl({value: '', disabled: true}, Validators.required)
        });
    }

    resetComponents() {
        this._colognes = this._locations = this._municipalities = [];
        this._states_countries = this._states_countries_original;
        this.controls.branch_office_cologne.setValue('');
        this.controls.branch_office_cologne.disable();
        this.controls.branch_office_location.setValue('');
        this.controls.branch_office_location.disable();
        this.controls.branch_office_municipality.setValue('');
        this.controls.branch_office_municipality.disable();
        this.controls.branch_office_state_country.setValue('');
        this.controls.branch_office_state_country.disable();
        this.controls.branch_office_country.setValue('');
        this.controls.branch_office_country.disable();
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
