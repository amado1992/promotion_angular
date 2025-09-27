import {Action, createReducer, on} from '@ngrx/store';

import * as productsActions from '../../products/redux/products.actions';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import {FilterModel} from '../../common/models/filter.model';
import {GeneralUtil} from '../../common/utils/general.util';
import {ProductModel} from '../models/product.model';

export class ProductState {
    products: DataWithFilter<ProductModel>;

    constructor() {
        this.products = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _productsReducer = createReducer(
    new ProductState(),
    on(productsActions.filterAllProducts, (state, {filter}) => ({
        ...state,
        products: GeneralUtil.setWithFilter(filter, state.products.value, state.products.total)
    })),
    on(productsActions.filterAllProductsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.products.filter};
        return {
            ...state,
            products: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    })
);

export function productsReducer(state: ProductState | undefined, action: Action) {
    return _productsReducer(state, action);
}
