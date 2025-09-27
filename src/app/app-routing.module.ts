import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {environment} from '../environments/environment';
import {metaReducers} from './main/common/redux/local.storage.sync';
import {generalReducer} from './main/common/redux/general.reducers';
import {GeneralEffects} from './main/common/redux/general.effects';
import {IsLoggedGuard} from './main/common/guards/isLogged.guard';

const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./main/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'customers',
        loadChildren: () => import('./main/customers/customers.module').then(m => m.CustomersModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'branchOffices',
        loadChildren: () => import('./main/branch-offices/branch-offices.module').then(m => m.BranchOfficesModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'products',
        loadChildren: () => import('./main/products/products.module').then(m => m.ProductsModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'users',
        loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'roles',
        loadChildren: () => import('./main/roles/roles.module').then(m => m.RolesModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'configurations',
        loadChildren: () => import('./main/configurations/configurations.module').then(m => m.ConfigurationsModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'orders',
        loadChildren: () => import('./main/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'inventories',
        loadChildren: () => import('./main/inventories/inventories.module').then(m => m.InventoriesModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
    {
        path: 'providers',
        loadChildren: () => import('./main/providers/providers.module').then(m => m.ProvidersModule),
        canActivate: [IsLoggedGuard],
        canLoad: [IsLoggedGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy'
        }),
        StoreModule.forRoot({general: generalReducer}, {metaReducers}),
        EffectsModule.forRoot([GeneralEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
