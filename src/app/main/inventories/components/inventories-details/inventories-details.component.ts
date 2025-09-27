import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { InventoryModel } from '../../models/inventory.model';
import { AppState } from '../../../common/redux/general.reducers';
import { Actions, ofType } from '@ngrx/effects';
import * as inventoriesActions from '../../redux/inventories.actions';

@Component({
    selector: 'app-inventories-details',
    templateUrl: './inventories-details.component.html',
    styleUrls: ['./inventories-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InventoriesDetailsComponent implements OnInit, OnDestroy {

    _inventory: InventoryModel;

    private _subscription = new Subscription();

    constructor(private _store: Store<AppState>,
        private _actions$: Actions, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.listeningActions();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this._inventory = state.inventoriesStore.inventory;
            console.log("DETAILS ", this._inventory)
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.adjustmentInventoryMovementsComplete))
                .subscribe(response => {
                    this._store.dispatch(inventoriesActions.saveInventory({ params: response.data.data }));
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.updateMovementComplete))
                .subscribe(response => {
                    this._store.dispatch(inventoriesActions.saveInventory({ params: response.data.data }));
                })
        );
    }
}
