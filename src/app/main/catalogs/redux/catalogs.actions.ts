import {createAction, props} from '@ngrx/store';

import {FilterModel} from '../../common/models/filter.model';

export const getAllCatalogs = createAction('[Catalogs] Get All Catalogs');
export const getAllCatalogsComplete = createAction('[Catalogs] Get All Catalogs Complete', props<{ data: any }>());
export const filterAllCatalogs = createAction('[Catalogs] Filter All Catalogs', props<{ filter: FilterModel }>());
export const filterAllCatalogsComplete = createAction('[Catalogs] Filter All Catalogs Complete', props<{ data: any }>());
export const addNewCatalogue = createAction('[Catalogs] Add New Catalogue', props<{ params: any }>());
export const addNewCatalogueComplete = createAction('[Catalogs] Add New Catalogue Complete', props<{ data: any }>());
export const updateCatalogue = createAction('[Catalogs] Update Catalogue', props<{ params: any }>());
export const updateCatalogueComplete = createAction('[Catalogs] Update Catalogue Complete', props<{ data: any }>());
export const destroyCatalogue = createAction('[Catalogs] Destroy Catalogue', props<{ params: any }>());
export const destroyCatalogueComplete = createAction('[Catalogs] Destroy Catalogue Complete', props<{ data: any }>());
