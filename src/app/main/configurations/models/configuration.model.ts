import {FiscalRegimenModel} from '../../common/models/fiscal-regimen.model';
import {StateCountryModel} from '../../common/models/state-country.model';
import {CountryModel} from '../../common/models/country.model';
import {CologneModel} from '../../common/models/cologne.model';
import {LocationModel} from '../../common/models/location.model';
import {MunicipalityModel} from '../../common/models/municipality.model';
import {PostalCodeModel} from '../../common/models/postal-code.model';

export class ConfigurationModel {
    id: number;
    trade_name: string;
    reason_social: string;
    rfc: string;
    email: string;
    cellphone: string;
    website: string;
    street: string;
    exterior_number: string;
    interior_number: string;
    fiscal_regimen: FiscalRegimenModel;
    cologne: CologneModel;
    location: LocationModel;
    municipality: MunicipalityModel;
    state_country: StateCountryModel;
    country: CountryModel;
    postal_code: PostalCodeModel;
    photo: string;
}

export class AccountConfigurationModel {
    id: number;
    bank_name: string;
    bank_rfc: string;
    number_account: string;
    active: boolean;
    deleted: boolean;
}

export class FolioConfigurationModel {
    id: number;
    series: string;
    quantity: number;
    used: number;
}

export class NotificationConfigurationModel {
    id: number;
    sending_invoices: boolean;
    sending_consignment_notes: boolean;
    accounts_receivable_reminder: boolean;
}

export class PacConfigurationModel {
    id: number;
    url_stamp: string;
    url_cancel: string;
    user: string;
    password: string;
    team: string;
}
