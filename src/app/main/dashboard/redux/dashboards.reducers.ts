import {Action, createReducer} from '@ngrx/store';

export class DashboardState {
    constructor() {
    }
}

const _dashboardsReducer = createReducer(
    new DashboardState()
);

export function dashboardsReducer(state: DashboardState | undefined, action: Action) {
    return _dashboardsReducer(state, action);
}
