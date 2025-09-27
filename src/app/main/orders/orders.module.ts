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
import { OrdersIndexComponent } from './components/orders-index/orders-index.component';
import { OrdersNewComponent } from './components/orders-new/orders-new.component';
import { OrdersProductsComponent } from './components/orders-products/orders-products.component';
import { OrdersUpdateComponent } from './components/orders-update/orders-update.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        OrdersIndexComponent,
        OrdersNewComponent,
        OrdersProductsComponent,
        OrdersUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        TranslateModule,
        OrdersRoutingModule,
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
export class OrdersModule {
}
