import {createAction, props} from '@ngrx/store';

import { FilterModel } from '../../common/models/filter.model';

export const filterAllInventories = createAction('[Inventories] Filter All Inventories', props<{ filter: FilterModel }>());
export const filterAllInventoriesComplete = createAction('[Inventories] Filter All Inventories Complete', props<{ data: any }>());

export const addNewInventory = createAction('[Inventories] Add New Inventory', props<{ params: any }>());
export const addNewInventoryComplete = createAction('[Inventories] Add New Inventory Complete', props<{ data: any }>());

export const saveInventory = createAction('[Inventories] Save Inventory', props<{ params: any }>());
export const saveInventoryComplete = createAction('[Inventories] Save Inventory Complete', props<{ data: any }>());

export const updateInventory = createAction('[Inventories] Update Inventory', props<{ params: any }>());
export const updateInventoryComplete = createAction('[Inventories] Update Inventory Complete', props<{ data: any }>());

export const destroyInventory = createAction('[Inventories] Destroy Inventory', props<{ params: any }>());
export const destroyInventoryComplete = createAction('[Inventories] Destroy Inventory Complete', props<{ data: any }>());

export const getInventoriesExportExcel = createAction('[Inventories] Get Inventories Export Excel', props<{ filters: any}>());
export const getInventoriesExportExcelComplete = createAction('[Inventories] Get Inventories Export Excel Complete', props<{ data: any }>());

export const adjustmentInventoryMovements = createAction('[Inventories] Adjustment Inventory Movements', props<{ inventory_id: any, params: any }>());
export const adjustmentInventoryMovementsComplete = createAction('[Inventories] Adjustment Inventory Movements Complete', props<{ data: any }>());

export const filterAllInventoryMovements = createAction('[Inventories] Filter All Inventory Movements', props<{ inventory_id: any, filter: FilterModel }>());
export const filterAllInventoryMovementsComplete = createAction('[Inventories] Filter All Inventory Movements Complete', props<{ data: any }>());

export const getInventoryPdf = createAction('[Inventories] Get Inventory Pdf', props<{ inventory_id: any, filter: FilterModel }>());
export const getInventoryPdfComplete = createAction('[Inventories] Get Inventory Pdf Complete', props<{ data: any }>());

export const updateMovement = createAction('[Inventories] Update Inventory Movements', props<{ params: any }>());
export const updateMovementComplete = createAction('[Inventories] Update Inventory Movements Complete', props<{ data: any }>());

export const destroyMovement = createAction('[Inventories] Destroy Movement', props<{ params: any }>());
export const destroyMovementComplete = createAction('[Inventories] Destroy Movement Complete', props<{ data: any }>());

export const saveInventoriesFilters = createAction('[Inventories] Save Inventories Filters', props<{ params: any }>());
export const saveInventoriesFiltersComplete = createAction('[Inventories] Save Inventories Filters Complete', props<{ data: any }>());