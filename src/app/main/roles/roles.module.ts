import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {RolesRoutingModule} from './roles-routing.module';
import {RolesUpdateComponent} from './components/roles-update/roles-update.component';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';
import {RolesIndexComponent} from './components/roles-index/roles-index.component';
import {RolesNewComponent} from './components/roles-new/roles-new.component';

@NgModule({
    declarations: [
        RolesIndexComponent,
        RolesNewComponent,
        RolesUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        RolesRoutingModule,
        NgSelectModule,
        DirectivesModule
    ]
})
export class RolesModule {
}
