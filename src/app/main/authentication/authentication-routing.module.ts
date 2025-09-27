import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {LoginComponent} from './components/login/login.component';
import {authenticationReducer} from './redux/authentication.reducers';
import {AuthenticationEffects} from './redux/authentication.effects';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('auth', authenticationReducer),
        EffectsModule.forFeature([AuthenticationEffects])
    ],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
