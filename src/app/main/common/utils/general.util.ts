import {FormGroup, ValidationErrors} from '@angular/forms';

import {FilterModel} from '../models/filter.model';

export class GeneralUtil {

    static setWithFilter(filter: FilterModel = new FilterModel(), value, total) {
        // This object contains the original value
        // as well as the time when it is supposed to expire
        return {filter: filter, value: value, total: total};
    }

    static matchPassword(controlName: string, matchControlName: string) {
        return (formGroup: FormGroup): ValidationErrors => {
            const control = formGroup.controls[controlName];
            const matchControl = formGroup.controls[matchControlName];
            if (matchControl.errors && !matchControl.errors.matchPassword) {
                return;
            }
            if (control.value !== matchControl.value) {
                matchControl.setErrors({matchPassword: true});
            } else {
                matchControl.setErrors(null);
            }
        };
    }
}
