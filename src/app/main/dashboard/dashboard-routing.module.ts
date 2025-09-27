import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {dashboardsReducer} from './redux/dashboards.reducers';
import {DashboardComponent} from './componentes/dashboard/dashboard.component';
import {DashboardsEffects} from './redux/dashboards.effects';
import { OrdersEffects } from '../orders/redux/orders.effects';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('dashboards', dashboardsReducer),
        EffectsModule.forFeature([DashboardsEffects, OrdersEffects])
    ],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
