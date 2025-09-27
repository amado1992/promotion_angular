import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { InventoryModel } from '../../models/inventory.model';
import { AppState } from '../../../common/redux/general.reducers';
import * as inventoriesActions from '../../redux/inventories.actions';
import { MessageService } from 'app/main/common/services/message.service';
import Swal from 'sweetalert2';
import { MotiveMovement } from '../../models/movement.model';

@Component({
    selector: 'app-inventories-adjustment',
    templateUrl: './inventories-adjustment.component.html',
    styleUrls: ['./inventories-adjustment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InventoriesAdjustmentComponent implements OnInit, OnDestroy {

    @Input() inventory: InventoryModel;

    _adjustmentInventoryForm: FormGroup;
    _submitted = false;

    _motive_movements: any = []

    private _subscription = new Subscription();
    motiveMovement: MotiveMovement;

    constructor(private _activeModal: NgbActiveModal,
        private _store: Store<AppState>,
        private _actions$: Actions,
        private _messageService: MessageService,) {
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeForm();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onCreate(): void {
        this._submitted = true;
        if (this._adjustmentInventoryForm.invalid) {
            return;
        }

        const inventory = {
            'amount': this.motiveMovement != undefined && this.motiveMovement.operation != 'ADJUSTMENT' ? this._adjustmentInventoryForm.get('amount').value : 0,
            'observation': this._adjustmentInventoryForm.get('observation').value,
            'motive_movement_id': this._adjustmentInventoryForm.get('motive_movement').value,
            'product_id': this.inventory.product.id,
            'branch_office_id': this.inventory.branchOffices.id
        };

        this._store.dispatch(inventoriesActions.adjustmentInventoryMovements({
            inventory_id: this.inventory.id,
            params: inventory
        }));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._adjustmentInventoryForm.controls;
    }

    listeningActions(): void {

        this._subscription.add(
            this._store.subscribe((state) => {
                if (state.auth.auth) {
                    this._motive_movements = state.auth.motive_movements;
                }
            })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(inventoriesActions.adjustmentInventoryMovementsComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                    
                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._adjustmentInventoryForm = new FormGroup({
            'amount': new FormControl(0, Validators.required),
            'motive_movement': new FormControl('', Validators.required),
            'observation': new FormControl('', Validators.required)
        });
    }

    onChangeMotiveMovement(event) {
        if (!event) {
            this.motiveMovement = null;
            return;
        }
        this.motiveMovement = this._motive_movements.find(function (motiveMovement) {
            return motiveMovement.id === event;
        });
    }
}
