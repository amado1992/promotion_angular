import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {PermissionGuard} from '../common/guards/permission.guard';
import {usersReducer} from './redux/users.reducers';
import {UsersEffects} from './redux/users.effects';
import {UsersIndexComponent} from './components/users-index/users-index.component';
import {UsersSettingComponent} from './components/users-setting/users-setting.component';

const routes: Routes = [
    {
        path: 'index',
        component: UsersIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'user.users.read'}
    },
    {
        path: 'account-settings',
        component: UsersSettingComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UsersEffects])
    ],
    exports: [RouterModule]
})
export class UsersRoutingModule {
}
