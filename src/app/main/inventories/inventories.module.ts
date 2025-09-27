import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbDateParserFormatter, NgbDatepickerI18n, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FileUploadModule} from 'ng2-file-upload';
import {NgxMaskModule} from 'ngx-mask';

import {PipesModule} from '../common/pipes/pipes.module';
import {CoreSidebarModule} from '../../../@core/components';
import {CoreCommonModule} from '../../../@core/common.module';
import {DirectivesModule} from '../common/directives/directives.module';
import {DateFormatPipe} from '../common/pipes/dateFormat/date-format.pipe';
import {CustomDateParserFormatter} from '../consignment-notes/services/custom-date-parser-formatter';
import {CustomerDatePickerI18n, I18n} from '../consignment-notes/services/customer-date-picker-i18n';
import { InventoriesIndexComponent } from './components/inventories-index/inventories-index.component';
import { InventoriesNewComponent } from './components/inventories-new/inventories-new.component';
import { InventoriesUpdateComponent } from './components/inventories-update/inventories-update.component';
import { InventoriesRoutingModule } from './inventories-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { InventoriesComponent } from './components/inventories/inventories.component';
import { InventoriesDetailsComponent } from './components/inventories-details/inventories-details.component';
import { MovementsIndexComponent } from './components/movements-index/movements-index.component';
import { InventoriesAdjustmentComponent } from './components/inventories-adjustment/inventories-adjustment.component';
import { MovementUpdateComponent } from './components/movements-update/movements-update.component';

@NgModule({
    declarations: [
        InventoriesIndexComponent,
        InventoriesNewComponent,
        InventoriesUpdateComponent,
        InventoriesComponent,
        InventoriesDetailsComponent,
        MovementsIndexComponent,
        InventoriesAdjustmentComponent,
        MovementUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        TranslateModule,
        InventoriesRoutingModule,
        NgSelectModule,
        FileUploadModule,
        DirectivesModule,
        PipesModule,
        NgxMaskModule.forRoot(),
        NgChartsModule
    ],
    providers: [
        DateFormatPipe,
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
        I18n,
        {provide: NgbDatepickerI18n, useClass: CustomerDatePickerI18n}
    ]
})
export class InventoriesModule {
}
