import {Action, createReducer, on} from '@ngrx/store';

import * as catalogsActions from '../../catalogs/redux/catalogs.actions';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import {FilterModel} from '../../common/models/filter.model';
import {CatalogueModel} from '../models/catalogue.model';
import {GeneralUtil} from '../../common/utils/general.util';

export class CatalogueState {
    catalogs: DataWithFilter<CatalogueModel>;

    constructor() {
        this.catalogs = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _catalogsReducer = createReducer(
    new CatalogueState(),
    on(catalogsActions.filterAllCatalogs, (state, {filter}) => ({
        ...state,
        catalogs: GeneralUtil.setWithFilter(filter, state.catalogs.value, state.catalogs.total)
    })),
    on(catalogsActions.filterAllCatalogsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.catalogs.filter};
        return {
            ...state,
            catalogs: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function catalogsReducer(state: CatalogueState | undefined, action: Action) {
    return _catalogsReducer(state, action);
}
