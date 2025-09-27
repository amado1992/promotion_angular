import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './componentes/dashboard/dashboard.component';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        DashboardRoutingModule,
        NgChartsModule
    ]
})
export class DashboardModule {
}
