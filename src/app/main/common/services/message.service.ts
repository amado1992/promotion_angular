import {Injectable} from '@angular/core';
import {SweetAlertOptions} from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private _translateService: TranslateService) {
    }

    BuildConfirmation(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'question',
            heightAuto: false,
            showCancelButton: true,
            cancelButtonText: '',
            confirmButtonText: '',
            reverseButtons: true,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildMessage(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            timer: 4000,
            heightAuto: false,
            showConfirmButton: false,
            showCancelButton: false,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildSuccess(mess: string, titleStr: string = '', timerInt: number = 2000) {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'success',
            timer: timerInt,
            heightAuto: false,
            showConfirmButton: false,
            showCancelButton: false,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildSuccessConfirmation(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'success',
            heightAuto: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'OK',
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildSuccessQuestion(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'success',
            heightAuto: false,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '',
            cancelButtonText: '',
            reverseButtons: true,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildWarningSuccess(mess: string, titleStr: string = '', timerInt: number = 4000) {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'warning',
            timer: timerInt,
            heightAuto: false,
            showConfirmButton: false,
            showCancelButton: false,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildWarning(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'warning',
            heightAuto: false,
            showCancelButton: false,
            confirmButtonText: '',
            reverseButtons: true,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildQuestion(mess: string, titleStr: string = '') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'question',
            heightAuto: false,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
            reverseButtons: true,
            html: mess,
            customClass: {}
        };
        return body;
    }

    BuildError(mess: string, titleStr: string = 'Oops!') {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            icon: 'warning',
            heightAuto: false,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            showCloseButton: false,
            showCancelButton: false,
            html: mess,
            customClass: {}
        };
        return body;
    }

    buildToast(mess: string, titleStr: string = '', timerInt: number = 4000) {
        let body: SweetAlertOptions;
        body = {
            title: titleStr,
            html: mess,
            icon: 'warning',
            customClass: {container: 'toast'},
            toast: true,
            timer: timerInt,
            position: 'top-end',
            showConfirmButton: false,
            showCancelButton: false
        };
        return body;
    }
}
