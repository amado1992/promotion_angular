import {Action, createReducer, on} from '@ngrx/store';

import * as ordersActions from './orders.actions';
import {GeneralUtil} from '../../common/utils/general.util';
import {FilterModel} from '../../common/models/filter.model';
import {DataWithFilter} from '../../common/interfaces/data-with-filter';
import { OrderModel } from '../models/orders.model';

export class OrdersState {
    order: OrderModel;
    orders: DataWithFilter<OrderModel>;

    constructor() {
        this.orders = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
    }
}

const _ordersReducer = createReducer(
    new OrdersState(),
    on(ordersActions.filterAllOrders, (state, {filter}) => ({
        ...state,
        orders: GeneralUtil.setWithFilter(filter, state.orders.value, state.orders.total)
    })),
    on(ordersActions.filterAllOrdersComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.orders.filter};
        return {
            ...state,
            orders: GeneralUtil.setWithFilter(newFilter, newArray, total)
        };
    }),
    on(ordersActions.saveOrder, (state, {params}) => {
        return {
            ...state,
            order: params
        };
    })
);

export function ordersReducer(state: OrdersState | undefined, action: Action) {
    return _ordersReducer(state, action);
}
