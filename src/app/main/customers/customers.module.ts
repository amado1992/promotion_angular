import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';

import {CustomersRoutingModule} from './customers-routing.module';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';
import {CustomersNewComponent} from './components/customers-new/customers-new.component';
import {CustomersIndexComponent} from './components/customers-index/customers-index.component';
import {CustomersUpdateComponent} from './components/customers-update/customers-update.component';
import {CustomersNewInModalComponent} from './components/customers-new-in-modal/customers-new-in-modal.component';
import { CustomersAccountIndexComponent } from './components/customers-account-index/customers-account-index.component';
import { CustomersAccountNewComponent } from './components/customers-account-new/customers-account-new.component';
import { CustomersAccountUpdateComponent } from './components/customers-account-update/customers-account-update.component';

@NgModule({
    declarations: [
        CustomersNewComponent,
        CustomersIndexComponent,
        CustomersUpdateComponent,
        CustomersNewInModalComponent,
        CustomersAccountIndexComponent,
        CustomersAccountNewComponent,
        CustomersAccountUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        CustomersRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ]
})
export class CustomersModule {
}
