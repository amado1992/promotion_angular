import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';

import {ProvidersRoutingModule} from './providers-routing.module';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';
import {ProvidersIndexComponent} from './components/providers-index/providers-index.component';
import {ProvidersNewComponent} from './components/providers-new/providers-new.component';
import {ProvidersUpdateComponent} from './components/providers-update/providers-update.component';
import {ProvidersAccountIndexComponent} from "./components/providers-account-index/providers-account-index.component";
import {ProvidersAccountNewComponent} from "./components/providers-account-new/providers-account-new.component";
import {ProvidersAccountUpdateComponent} from "./components/providers-account-update/providers-account-update.component";

@NgModule({
    declarations: [
        ProvidersIndexComponent,
        ProvidersNewComponent,
        ProvidersUpdateComponent,
        ProvidersAccountIndexComponent,
        ProvidersAccountNewComponent,
        ProvidersAccountUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        ProvidersRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ]
})
export class ProvidersModule {
}
