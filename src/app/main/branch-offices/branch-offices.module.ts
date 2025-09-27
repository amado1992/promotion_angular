import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';

import {BranchOfficesIndexComponent} from './components/branch-offices-index/branch-offices-index.component';
import {BranchOfficesNewComponent} from './components/branch-offices-new/branch-offices-new.component';
import {BranchOfficesUpdateComponent} from './components/branch-offices-update/branch-offices-update.component';
import {BranchOfficesRoutingModule} from './branch-offices-routing.module';
import {CoreCommonModule} from '../../../@core/common.module';
import {CoreSidebarModule} from '../../../@core/components';
import {DirectivesModule} from '../common/directives/directives.module';

@NgModule({
    declarations: [
        BranchOfficesIndexComponent,
        BranchOfficesNewComponent,
        BranchOfficesUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        BranchOfficesRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ]
})
export class BranchOfficesModule {
}
