import {NgModule} from '@angular/core';

import {PermissionDirective} from './permission/permission.directive';

@NgModule({
    declarations: [PermissionDirective],
    exports: [PermissionDirective]
})
export class DirectivesModule {
}
