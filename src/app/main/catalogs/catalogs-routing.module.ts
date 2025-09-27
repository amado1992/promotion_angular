import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {catalogsReducer} from './redux/catalogs.reducer';
import {CatalogsEffects} from './redux/catalogs.effects';

const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('catalogs', catalogsReducer),
        EffectsModule.forFeature([CatalogsEffects])
    ],
    exports: [RouterModule]
})
export class CatalogsRoutingModule {
}
