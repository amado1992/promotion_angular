import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';

import {UsersRoutingModule} from './users-routing.module';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';
import {UsersIndexComponent} from './components/users-index/users-index.component';
import {UsersNewComponent} from './components/users-new/users-new.component';
import {UsersUpdateComponent} from './components/users-update/users-update.component';
import {UsersSettingComponent} from './components/users-setting/users-setting.component';

@NgModule({
    declarations: [
        UsersIndexComponent,
        UsersNewComponent,
        UsersUpdateComponent,
        UsersSettingComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        UsersRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ]
})
export class UsersModule {
}
