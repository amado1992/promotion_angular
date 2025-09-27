import {Action, createReducer, on} from '@ngrx/store';

import {FilterModel} from "../../common/models/filter.model";
import {GeneralUtil} from "../../common/utils/general.util";
import {DataWithFilter} from "../../common/interfaces/data-with-filter";
import * as configurationsActions from '../../configurations/redux/configurations.actions';
import {AccountConfigurationModel,ConfigurationModel,NotificationConfigurationModel} from '../models/configuration.model';

export class ConfigurationState {
    configuration: ConfigurationModel;
    accountConfigurations: DataWithFilter<AccountConfigurationModel>;
    notificationConfiguration: NotificationConfigurationModel;

    constructor() {
        this.configuration = null;
        this.accountConfigurations = {
            filter: new FilterModel(),
            value: [],
            total: 0
        };
        this.notificationConfiguration = null;
    }
}

const _configurationsReducer = createReducer(
    new ConfigurationState(),
    on(configurationsActions.getConfigurationComplete, (state, {data}) => {
        const configuration = data.data;
        return {
            ...state,
            configuration: configuration
        };
    }),
    on(configurationsActions.updateConfigurationComplete, (state, {data}) => {
        const configuration = data.data;
        return {
            ...state,
            configuration: configuration
        };
    }),
    on(configurationsActions.filterAllAccountConfigurations, (state, {filter}) => ({
        ...state,
        accountConfigurations: GeneralUtil.setWithFilter(filter, state.accountConfigurations.value, state.accountConfigurations.total)
    })),
    on(configurationsActions.filterAllAccountConfigurationsComplete, (state, {data}) => {
        const newArray = data.data.data;
        const total = data.data.total;
        const newFilter = {...state.accountConfigurations.filter};
        return {
            ...state,
            accountConfigurations: GeneralUtil.setWithFilter(newFilter, newArray, total)
        }
    }),
    on(configurationsActions.getNotificationConfigurationComplete, (state, {data}) => {
        const notificationConfiguration = data.data;
        return {
            ...state,
            notificationConfiguration: notificationConfiguration
        };
    }),
    on(configurationsActions.updateNotificationConfigurationComplete, (state, {data}) => {
        const notificationConfiguration = data.data;
        return {
            ...state,
            notificationConfiguration: notificationConfiguration
        };
    })
);

export function configurationsReducer(state: ConfigurationState | undefined, action: Action) {
    return _configurationsReducer(state, action);
}
