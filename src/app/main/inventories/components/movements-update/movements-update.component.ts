import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../../common/redux/general.reducers';
import * as inventoriesActions from '../../redux/inventories.actions';
import { MessageService } from 'app/main/common/services/message.service';
import Swal from 'sweetalert2';
import { MovementModel } from '../../models/movement.model';

@Component({
    selector: 'app-movements-update',
    templateUrl: './movements-update.component.html',
    styleUrls: ['./movements-update.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MovementUpdateComponent implements OnInit, OnDestroy {

    @Input() movement: MovementModel;

    _updateMovementForm: FormGroup;
    _submitted = false;

    _motive_movements: any = []

    private _subscription = new Subscription();

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

    onUpdate(): void {
        this._submitted = true;
        if (this._updateMovementForm.invalid) {
            return;
        }

        const movement = {
            'amount': this._updateMovementForm.get('amount').value,
            'observation': this._updateMovementForm.get('observation').value,
            'motive_movement_id': this.movement.motive_movement_id,
            'inventory_id': this.movement.inventory_id,
            'id': this.movement.id
        };

        this._store.dispatch(inventoriesActions.updateMovement({ params: movement }));
    }

    onClose(): void {
        this._activeModal.close();
    }

    get controls() {
        return this._updateMovementForm.controls;
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
                .pipe(ofType(inventoriesActions.updateMovementComplete))
                .subscribe(response => {
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });

                    this.onClose();
                })
        );
    }

    initializeForm(): void {
        this._updateMovementForm = new FormGroup({
            'amount': new FormControl(this.movement.amount),
            'observation': new FormControl(this.movement.observation, Validators.required),
            'motive_movement_id': new FormControl(this.movement.motive_movement_id),
            'motive': new FormControl(this.movement?.motive_movement?.name)
        });
    }
}
