import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {PermissionGuard} from '../common/guards/permission.guard';
import {BranchOfficesIndexComponent} from './components/branch-offices-index/branch-offices-index.component';
import {branchOfficesReducer} from './redux/branch-offices.reducers';
import {BranchOfficesEffects} from './redux/branch-offices.effects';

const routes: Routes = [
    {
        path: 'index',
        component: BranchOfficesIndexComponent,
        canActivate: [PermissionGuard],
        data: {permission: 'common.branchOffices.read'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature('branchOffices', branchOfficesReducer),
        EffectsModule.forFeature([BranchOfficesEffects])
    ],
    exports: [RouterModule]
})
export class BranchOfficesRoutingModule {
}
