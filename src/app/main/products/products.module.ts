import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsIndexComponent } from './components/products-index/products-index.component';
import { ProductsNewComponent } from './components/products-new/products-new.component';
import { ProductsUpdateComponent } from './components/products-update/products-update.component';
import { CoreCommonModule } from '../../../@core/common.module';
import { CoreSidebarModule } from '../../../@core/components';
import { DirectivesModule } from '../common/directives/directives.module';
import { DateFormatPipe } from '../common/pipes/dateFormat/date-format.pipe';

@NgModule({
    declarations: [
        ProductsIndexComponent,
        ProductsNewComponent,
        ProductsUpdateComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        CoreSidebarModule,
        NgbModule,
        NgxDatatableModule,
        ProductsRoutingModule,
        NgSelectModule,
        DirectivesModule,
        NgxMaskModule.forRoot()
    ], providers: [DateFormatPipe]
})
export class ProductsModule {
}
