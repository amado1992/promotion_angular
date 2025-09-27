import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RolesEffects} from './redux/roles.effects';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {RolesIndexComponent} from './components/roles-index/roles-index.component';
import {PermissionGuard} from '../common/guards/permission.guard';
import {rolesReducer} from './redux/roles.reducers';

const routes: Routes = [
    {
        path: 'index',
        component: RolesIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'user.roles.read'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('roles', rolesReducer),
        EffectsModule.forFeature([RolesEffects])
    ],
    exports: [RouterModule]
})
export class RolesRoutingModule {
}
