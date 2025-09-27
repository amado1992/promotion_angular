import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';

import {ConfigurationsRoutingModule} from './configurations-routing.module';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';
import {ConfigurationsComponent} from './components/configurations/configurations.component';
import {ConfigurationsGeneralComponent} from './components/configurations-general/configurations-general.component';
import { ConfigurationsAccountIndexComponent } from './components/configurations-account-index/configurations-account-index.component';
import { ConfigurationsAccountNewComponent } from './components/configurations-account-new/configurations-account-new.component';
import { ConfigurationsAccountUpdateComponent } from './components/configurations-account-update/configurations-account-update.component';

@NgModule({
    declarations: [
        ConfigurationsComponent,
        ConfigurationsGeneralComponent,
        ConfigurationsAccountIndexComponent,
        ConfigurationsAccountNewComponent,
        ConfigurationsAccountUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        ConfigurationsRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ]
})
export class ConfigurationsModule {
}
