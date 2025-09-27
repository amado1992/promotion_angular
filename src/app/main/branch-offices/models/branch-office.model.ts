import {StateCountryModel} from '../../common/models/state-country.model';
import {CountryModel} from '../../common/models/country.model';
import {CologneModel} from '../../common/models/cologne.model';
import {LocationModel} from '../../common/models/location.model';
import {MunicipalityModel} from '../../common/models/municipality.model';
import {PostalCodeModel} from '../../common/models/postal-code.model';

export class BranchOfficeModel {
    id: number;
    number: string;
    name: string;
    serial: string;
    email: string;
    phone: string;
    whatsapp: string;
    street: string;
    exterior_number: string;
    interior_number: string;
    cologne: CologneModel;
    location: LocationModel;
    municipality: MunicipalityModel;
    state_country: StateCountryModel;
    country: CountryModel;
    postal_code: PostalCodeModel;
}
