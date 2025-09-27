import { Action, createReducer, on } from '@ngrx/store';

import * as inventoriesActions from './inventories.actions';
import { GeneralUtil } from '../../common/utils/general.util';
import { FilterModel } from '../../common/models/filter.model';
import { DataWithFilter } from '../../common/interfaces/data-with-filter';
import { InventoryModel } from '../models/inventory.model';
import { MovementModel } from '../models/movement.model';

export class InventoriesState {
    inventory: InventoryModel;
    inventories: DataWithFilter<InventoryModel>;
    movements: DataWithFilter<MovementModel>;
    filters: [];

    constructor() {
        this.inventories = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };

        this.movements = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };

        this.filters = [];
    }
}

const _invetoriesReducer = createReducer(
    new InventoriesState(),
    on(inventoriesActions.filterAllInventories, (state, { filter }) => ({
        ...state,
        inventories: GeneralUtil.setWithFilter(filter, state.inventories.value, state.inventories.total)
    })),
    on(inventoriesActions.filterAllInventoriesComplete, (state, { data }) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = { ...state.inventories.filter };
        return {
            ...state,
            inventories: GeneralUtil.setWithFilter(newFilter, newArray, total)
        };
    }),
    on(inventoriesActions.saveInventory, (state, { params }) => {
        return {
            ...state,
            inventory: params
        };
    }),
    on(inventoriesActions.filterAllInventoryMovements, (state, {filter}) => ({
        ...state,
        movements: GeneralUtil.setWithFilter(filter, state.movements.value, state.movements.total)
    })),
    on(inventoriesActions.filterAllInventoryMovementsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.movements.filter};
        return {
            ...state,
            movements: GeneralUtil.setWithFilter(newFilter, newArray, total)
        };
    }),
    on(inventoriesActions.saveInventoriesFilters, (state, { params }) => {
        return {
            ...state,
            filters: params
        };
    }),
);

export function inventoriesReducer(state: InventoriesState | undefined, action: Action) {
    return _invetoriesReducer(state, action);
}
