import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const getAllProducts = createAction('[Products] Get All Products');
export const getAllProductsComplete = createAction('[Products] Get All Products Complete', props<{ data: any }>());
export const filterAllProducts = createAction('[Products] Filter All Products', props<{ filter: FilterModel }>());
export const filterAllProductsComplete = createAction('[Products] Filter All Products Complete', props<{ data: any }>());
export const addNewProduct = createAction('[Products] Add New Product', props<{ params: any }>());
export const addNewProductComplete = createAction('[Products] Add New Product Complete', props<{ data: any }>());
export const updateProduct = createAction('[Products] Update Product', props<{ params: any }>());
export const updateProductComplete = createAction('[Products] Update Product Complete', props<{ data: any }>());
export const destroyProduct = createAction('[Products] Destroy Product', props<{ params: any }>());
export const destroyProductComplete = createAction('[Products] Destroy Product Complete', props<{ data: any }>());
export const getAllProductsBySearch = createAction('[Products] Get All Products By Search', props<{ params: any }>());
export const getAllProductsBySearchComplete = createAction('[Products] Get All Products By Search Complete', props<{ data: any }>());

export const getProductsBySearch = createAction('[Products] Get Products By Search', props<{ params: any }>());
export const getProductsBySearchComplete = createAction('[Products] Get Products By Search Complete', props<{ data: any }>());