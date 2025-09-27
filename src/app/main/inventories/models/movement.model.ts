import {UserModel} from '../../users/models/user.model';

export class MovementModel {
    id: number;
    number: string;
    date: number;
    amount: number;
    balance: number;
    observation: string;
    motive_movement: MotiveMovement;
    user: UserModel;
    motive_movement_id: number;
    inventory_id: number;
}

export class MotiveMovement {
    id: number;
    number: string;
    name: string;
    operation: string;
    system: number;
    description: string;
}
