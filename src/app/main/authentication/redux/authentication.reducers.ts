import {Action, createReducer, on} from '@ngrx/store';

import * as authenticationActions from './authentication.actions';
import {Tokens} from '../../users/models/user.model';
import {RoleModel} from '../../roles/models/rol.model';
import {BranchOfficeModel} from '../../branch-offices/models/branch-office.model';
import {CountryModel} from '../../common/models/country.model';
import {StateCountryModel} from '../../common/models/state-country.model';
import {Permissions} from '../../roles/models/permission.model';
import {PaymentFormatModel} from '../../common/models/payment-format.model';
import {PaymentMethodModel} from '../../common/models/payment-method.model';
import {FiscalRegimenModel} from '../../common/models/fiscal-regimen.model';
import {UnitMeasurementModel} from '../../common/models/unit-measurement.model';
import {SimpleModel} from '../../common/models/simple.model';
import {UseCFDIModel} from '../../common/models/use-cfdi.model';
import {TrailerTypeModel} from '../../common/models/trailer-type.model';
import {TransportTypeModel} from '../../common/models/transport-type.model';
import {PermitTypeModel} from '../../common/models/permit-type.model';
import {PackagingTypeModel} from '../../common/models/packaging-type.model';
import {CveDangerousMaterialModel} from '../../common/models/cve-dangerous-material.model';
import {CancellationMotiveModel} from '../../common/models/cancellation-motive.model';
import {RelationshipTypeModel} from '../../common/models/relationship-type.model';

export class AuthState {
    auth: Tokens;
    roles: RoleModel[];
    branch_offices: BranchOfficeModel[];
    countries: CountryModel[];
    states_countries: StateCountryModel[];
    permissions: Permissions[];
    payment_formats: PaymentFormatModel[];
    payment_methods: PaymentMethodModel[];
    fiscal_regimens: FiscalRegimenModel[];
    use_cfdis: UseCFDIModel[];
    unit_measurements: UnitMeasurementModel[];
    product_categories: SimpleModel[];
    colors: SimpleModel[];
    truck_permissions: SimpleModel[];
    transport_types: TransportTypeModel[];
    permit_types: PermitTypeModel[];
    cve_dangerous_materials: CveDangerousMaterialModel[];
    packaging_types: PackagingTypeModel[];
    trailer_types: TrailerTypeModel[];
    merchandise_status: SimpleModel[];
    payment_types: SimpleModel[];
    types_travel: SimpleModel[];
    cancellation_motives: CancellationMotiveModel[];
    payment_credit_status: SimpleModel[];
    relationship_types: RelationshipTypeModel[];
    liquidation_status: SimpleModel[];
    bank_types: SimpleModel[];
    brands: SimpleModel[];
    physical_status: SimpleModel[];
    motive_movements: any[];

    constructor() {
        this.auth = null;
        this.roles = [];
        this.branch_offices = [];
        this.countries = [];
        this.states_countries = [];
        this.permissions = [];
        this.payment_formats = [];
        this.payment_methods = [];
        this.fiscal_regimens = [];
        this.use_cfdis = [];
        this.unit_measurements = [];
        this.product_categories = [];
        this.colors = [];
        this.truck_permissions = [];
        this.transport_types = [];
        this.permit_types = [];
        this.cve_dangerous_materials = [];
        this.packaging_types = [];
        this.trailer_types = [];
        this.merchandise_status = [];
        this.payment_types = [];
        this.types_travel = [];
        this.cancellation_motives = [];
        this.payment_credit_status = [];
        this.relationship_types = [];
        this.liquidation_status = [];
        this.bank_types = [];
        this.brands = [];
        this.physical_status = [];
        this.motive_movements = []
    }
}

const _authenticationReducer = createReducer(
    new AuthState,
    on(authenticationActions.login, state => ({...state})),
    on(authenticationActions.loginComplete, (state, {data}) => {
        const newAuth = {...state.auth};
        newAuth.access_token = data.access_token;
        newAuth.refresh_token = data.refresh_token;
        newAuth.expires_in = data.expires_in;
        newAuth.expire_date_unix = new Date().getTime() + data.expires_in * 1000;
        newAuth.is_refreshing = false;
        newAuth.user = null;
        return {
            ...state,
            auth: newAuth
        };
    }),
    on(authenticationActions.getUserLoggedComplete, (state, {data}) => {
        const newAuth = {...state.auth};
        newAuth.user = data.data.user;
        return {
            ...state,
            auth: newAuth,
            roles: data.data.roles,
            branch_offices: data.data.branch_offices,
            countries: data.data.countries,
            states_countries: data.data.states_countries,
            permissions: data.data.permissions,
            payment_formats: data.data.payment_formats,
            payment_methods: data.data.payment_methods,
            fiscal_regimens: data.data.fiscal_regimens,
            use_cfdis: data.data.use_cfdis,
            unit_measurements: data.data.unit_measurements,
            product_categories: data.data.product_categories,
            truck_permissions: data.data.truck_permissions,
            transport_types: data.data.transport_types,
            permit_types: data.data.permit_types,
            cve_dangerous_materials: data.data.cve_dangerous_materials,
            packaging_types: data.data.packaging_types,
            trailer_types: data.data.trailer_types,
            merchandise_status: data.data.merchandise_status,
            payment_types: data.data.payment_types,
            types_travel: data.data.types_travel,
            cancellation_motives: data.data.cancellation_motives,
            payment_credit_status: data.data.payment_credit_status,
            relationship_types: data.data.relationship_types,
            liquidation_status: data.data.liquidation_status,
            bank_types: data.data.bank_types,
            brands: data.data.brands,
            physical_status: data.data.physical_status,
            motive_movements: data.data.motive_movements
        };
    }),
    on(authenticationActions.changeAccountUserLoggedComplete, (state, {data}) => {
        const newAuth = {...state.auth};
        newAuth.user = data.data;
        return {
            ...state,
            auth: newAuth
        };
    }),
    on(authenticationActions.logoutComplete, (state) => {
        return {
            ...new AuthState()
        };
    }),
    on(authenticationActions.updateRolesInAuthStateComplete, (state, {data}) => {
        return {
            ...state,
            roles: data
        };
    }),
    on(authenticationActions.updateBranchOfficesInAuthStateComplete, (state, {data}) => {
        return {
            ...state,
            branch_offices: data
        };
    })
);

export function authenticationReducer(state: AuthState | undefined, action: Action) {
    return _authenticationReducer(state, action);
}
