import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {CoreCommonModule} from '../../../@core/common.module';
import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from './components/login/login.component';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CoreCommonModule
    ]
})
export class AuthenticationModule {
}
