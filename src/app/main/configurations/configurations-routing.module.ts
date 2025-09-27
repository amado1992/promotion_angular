import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {PermissionGuard} from '../common/guards/permission.guard';
import {configurationsReducer} from './redux/configurations.reducer';
import {ConfigurationsEffects} from './redux/configurations.effects';
import {ConfigurationsComponent} from './components/configurations/configurations.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationsComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'configuration.configurations.read'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('configurations', configurationsReducer),
        EffectsModule.forFeature([ConfigurationsEffects])
    ],
    exports: [RouterModule]
})
export class ConfigurationsRoutingModule {
}
