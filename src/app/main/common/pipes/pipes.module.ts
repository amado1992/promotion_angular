import { NgModule } from '@angular/core';

import { DateFormatPipe } from './dateFormat/date-format.pipe';

@NgModule({
  declarations: [DateFormatPipe],
  exports: [DateFormatPipe]
})
export class PipesModule { }
