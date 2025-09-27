import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, tap} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';

import * as generalActions from 'app/main/common/redux/general.actions';
import {FileUploadService} from '../services/file-upload.service';
import {PostalCodeService} from '../services/postal-code.service';

@Injectable()
export class GeneralEffects {

    constructor(private _actions$: Actions,
                private _fileUploadService: FileUploadService,
                private _postalCodeService: PostalCodeService,
                private _spinner: NgxSpinnerService) {
    }

    uploadFiles$ = createEffect(() =>
        this._actions$.pipe(
            ofType(generalActions.fileUpload),
            exhaustMap(action => {
                return this._fileUploadService.fileUpload(action.params).pipe(
                    map(data => {
                        return generalActions.fileUploadComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    uploadFilesMultiple$ = createEffect(() =>
        this._actions$.pipe(
            ofType(generalActions.fileUploadMultiple),
            exhaustMap(action => {
                return this._fileUploadService.fileUploadMultiple(action.params).pipe(
                    map(data => {
                        return generalActions.fileUploadMultipleComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );

    getUbications$ = createEffect(() =>
        this._actions$.pipe(
            ofType(generalActions.getUbications),
            tap((action) => this._spinner.show()),
            exhaustMap(action => {
                return this._postalCodeService.getByPostalCode(action.params).pipe(
                    map(data => {
                        this._spinner.hide();
                        return generalActions.getUbicationsComplete({data});
                    }),
                    catchError(error => of(generalActions.finish_state({error})))
                );
            })
        )
    );
}
