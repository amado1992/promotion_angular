import {createAction, props} from '@ngrx/store';

import { FilterModel } from '../../common/models/filter.model';

export const filterAllOrders = createAction('[Orders] Filter All Orders', props<{ filter: FilterModel }>());
export const filterAllOrdersComplete = createAction('[Orders] Filter All Orders Complete', props<{ data: any }>());

export const addNewOrder = createAction('[Orders] Add New Order', props<{ params: any }>());
export const addNewOrderComplete = createAction('[Orders] Add New Order Complete', props<{ data: any }>());

export const saveOrder = createAction('[Orders] Save Order', props<{ params: any }>());
export const saveOrderComplete = createAction('[Orders] Save Order Complete', props<{ data: any }>());

export const updateOrder = createAction('[Orders] Update Order', props<{ params: any }>());
export const updateOrderComplete = createAction('[Orders] Update Order Complete', props<{ data: any }>());

export const destroyOrder = createAction('[Orders] Destroy Order', props<{ params: any }>());
export const destroyOrderComplete = createAction('[Orders] Destroy Order Complete', props<{ data: any }>());

export const getOrdersExportExcel = createAction('[Orders] Get Orders Export Excel', props<{ filters: any}>());
export const getOrdersExportExcelComplete = createAction('[Orders] Get Orders Export Excel Complete', props<{ data: any }>());

export const getTopBranchOffices = createAction('[Orders] Get Orders Top BranchOffices');
export const getTopBranchOfficesComplete = createAction('[Orders] Get Top BranchOffices Complete', props<{ data: any }>());

export const getTopProducts = createAction('[Orders] Get Orders Top Products');
export const getTopProductsComplete = createAction('[Orders] Get Top Products Complete', props<{ data: any }>());

export const getTotals = createAction('[Orders] Get Orders Totals');
export const getTotalsComplete = createAction('[Orders] Get Totals Complete', props<{ data: any }>());

export const getOrderPdf = createAction('[Orders] Get Order Pdf', props<{ params: any }>());
export const getOrderPdfComplete = createAction('[Orders] Get Order Pdf Complete', props<{ data: any }>());