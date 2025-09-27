import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {NgModule} from '@angular/core';

import {PermissionGuard} from '../common/guards/permission.guard';
import {ProductsEffects} from '../products/redux/products.effects';
import {CustomersEffects} from '../customers/redux/customers.effects';
import { InventoriesNewComponent } from './components/inventories-new/inventories-new.component';
import { InventoriesUpdateComponent } from './components/inventories-update/inventories-update.component';
import { BranchOfficesEffects } from '../branch-offices/redux/branch-offices.effects';
import { InventoriesEffects } from './redux/inventories.effects';
import { inventoriesReducer } from './redux/inventories.reducers';
import { ProvidersEffects } from '../providers/redux/providers.effects';
import { InventoriesComponent } from './components/inventories/inventories.component';

const routes: Routes = [
    {
        path: 'index',
        component: InventoriesComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'inventory.inventories.read'}
    },
    {
        path: 'new',
        component: InventoriesNewComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'inventory.inventories.create'}
    },
    {
        path: 'update',
        component: InventoriesUpdateComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'inventory.inventories.update'}
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('inventoriesStore', inventoriesReducer),
        EffectsModule.forFeature([
            InventoriesEffects,
            CustomersEffects,
            ProductsEffects,
            BranchOfficesEffects,
            ProvidersEffects
        ])
    ],
    exports: [RouterModule]
})
export class InventoriesRoutingModule {
}
