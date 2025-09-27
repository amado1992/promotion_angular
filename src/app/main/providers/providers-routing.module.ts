import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {PermissionGuard} from '../common/guards/permission.guard';
import {ProvidersIndexComponent} from './components/providers-index/providers-index.component';
import {ProvidersNewComponent} from './components/providers-new/providers-new.component';
import {ProvidersUpdateComponent} from './components/providers-update/providers-update.component';
import {providersReducer} from './redux/providers.reducer';
import {ProvidersEffects} from './redux/providers.effects';

const routes: Routes = [
    {
        path: 'index',
        component: ProvidersIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'provider.providers.read'}
    },
    {
        path: 'new',
        component: ProvidersNewComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'provider.providers.create'}
    },
    {
        path: 'update',
        component: ProvidersUpdateComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'provider.providers.update'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('providers', providersReducer),
        EffectsModule.forFeature([ProvidersEffects])
    ],
    exports: [RouterModule]
})
export class ProvidersRoutingModule {
}
