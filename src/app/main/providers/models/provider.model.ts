import {FiscalRegimenModel} from '../../common/models/fiscal-regimen.model';
import {PaymentMethodModel} from '../../common/models/payment-method.model';
import {PaymentFormatModel} from '../../common/models/payment-format.model';
import {StateCountryModel} from '../../common/models/state-country.model';
import {CountryModel} from '../../common/models/country.model';
import {UseCFDIModel} from '../../common/models/use-cfdi.model';
import {CologneModel} from '../../common/models/cologne.model';
import {LocationModel} from '../../common/models/location.model';
import {MunicipalityModel} from '../../common/models/municipality.model';
import {PostalCodeModel} from '../../common/models/postal-code.model';

export class ProviderModel {
    id: number;
    reason_social: string;
    rfc: string;
    email: string;
    cellphone: string;
    phone: string;
    street: string;
    exterior_number: string;
    interior_number: string;
    payment_term: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    fiscal_regimen: FiscalRegimenModel;
    use_cfdi: UseCFDIModel;
    payment_method: PaymentMethodModel;
    payment_format: PaymentFormatModel;
    cologne: CologneModel;
    location: LocationModel;
    municipality: MunicipalityModel;
    state_country: StateCountryModel;
    country: CountryModel;
    postal_code: PostalCodeModel;
}
