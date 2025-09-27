import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {PermissionGuard} from '../common/guards/permission.guard';
import {customersReducer} from './redux/customers.reducer';
import {CustomersEffects} from './redux/customers.effects';
import {CustomersIndexComponent} from './components/customers-index/customers-index.component';
import {CustomersNewComponent} from './components/customers-new/customers-new.component';
import {CustomersUpdateComponent} from './components/customers-update/customers-update.component';

const routes: Routes = [
    {
        path: 'index',
        component: CustomersIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'customer.customers.read'}
    },
    {
        path: 'new',
        component: CustomersNewComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'customer.customers.create'}
    },
    {
        path: 'update',
        component: CustomersUpdateComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'customer.customers.update'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('customers', customersReducer),
        EffectsModule.forFeature([CustomersEffects])
    ],
    exports: [RouterModule]
})
export class CustomersRoutingModule {
}
