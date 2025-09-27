import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {NgModule} from '@angular/core';

import {PermissionGuard} from '../common/guards/permission.guard';
import {ProductsEffects} from '../products/redux/products.effects';
import {CustomersEffects} from '../customers/redux/customers.effects';
import { OrdersNewComponent } from './components/orders-new/orders-new.component';
import { OrdersIndexComponent } from './components/orders-index/orders-index.component';
import { OrdersUpdateComponent } from './components/orders-update/orders-update.component';
import { ordersReducer } from './redux/orders.reducers';
import { OrdersEffects } from './redux/orders.effects';
import { BranchOfficesEffects } from '../branch-offices/redux/branch-offices.effects';
import { CatalogsEffects } from '../catalogs/redux/catalogs.effects';
import { ProvidersEffects } from '../providers/redux/providers.effects';

const routes: Routes = [
    {
        path: 'index',
        component: OrdersIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'order.orders.read'}
    },
    {
        path: 'new',
        component: OrdersNewComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'order.orders.create'}
    },
    {
        path: 'update',
        component: OrdersUpdateComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'order.orders.update'}
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('ordersStore', ordersReducer),
        EffectsModule.forFeature([
            OrdersEffects,
            CustomersEffects,
            ProductsEffects,
            BranchOfficesEffects,
            CatalogsEffects,
            ProvidersEffects
        ])
    ],
    exports: [RouterModule]
})
export class OrdersRoutingModule {
}
