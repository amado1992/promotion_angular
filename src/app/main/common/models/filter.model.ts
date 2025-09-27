export class FilterModel {
    search?: { [key: string]: any | any[] };
    filters: Filter[];

    constructor() {
    }
}

export class Filter {
    attribute: string;
    operator: string;
    value: any;
}
