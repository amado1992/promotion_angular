import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {NgModule} from '@angular/core';

import {productsReducer} from './redux/products.reducer';
import {ProductsEffects} from './redux/products.effects';
import {PermissionGuard} from '../common/guards/permission.guard';
import {CatalogsEffects} from '../catalogs/redux/catalogs.effects';
import {ProductsIndexComponent} from './components/products-index/products-index.component';

const routes: Routes = [
    {
        path: 'index',
        component: ProductsIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'product.products.read'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('products', productsReducer),
        EffectsModule.forFeature([
            ProductsEffects,
            CatalogsEffects
        ])
    ],
    exports: [RouterModule]
})
export class ProductsRoutingModule {
}
