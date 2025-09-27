import {FilterModel} from '../models/filter.model';

export interface DataWithFilter<T> {
    filter: FilterModel;
    value: T[];
    total: number;
}
