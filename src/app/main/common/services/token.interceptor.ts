import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap, take, tap, timeout} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AppState} from '../redux/general.reducers';
import * as generalActions from '../redux/general.actions';
import * as authenticationActions from '../../authentication/redux/authentication.actions';
// import * as notificationsActions from '../../notifications/redux/notifications.actions';
import {MessageService} from './message.service';
import {PostalCodeService} from './postal-code.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    _is_refreshing = false;
    _access_token = '';

    constructor(private _store: Store<AppState>,
                private _actions$: Actions,
                private _messageService: MessageService,
                private _modal: NgbModal,
                private _spinner: NgxSpinnerService) {
        this._store.select((state: AppState) => state).subscribe(state => {
            if (state.auth.auth) {
                this._access_token = state.auth.auth.access_token;
                this._is_refreshing = state.auth.auth.is_refreshing;
            }
        });
    }

    /**
     * Intercept all HTTP Calls, and if the request in Unauthenticated then send a Refresh Token API Call
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this._access_token) {
            request = this.addToken(request, this._access_token);
        }

        return next.handle(request).pipe(
            timeout(180000),
            catchError(error => {
                this._store.dispatch(generalActions.hideLoading({showLoading: false}));

                if (error.name === 'TimeoutError') {
                    const messageAlert = 'Tiempo de conexión agotado';
                    Swal.fire(this._messageService.BuildError(messageAlert)).then(() => {
                    });
                    return throwError(error);
                } else if (error instanceof HttpErrorResponse) {
                    const httpErrorCode = error.status;
                    console.log(error);

                    let messageAlert = error.error.message ?
                        error.error.message.toUpperCase() :
                        ('La aplicación no puedo procesarse correctamente, Código: ' + httpErrorCode);
                    switch (httpErrorCode) {
                        case 0:
                        case 400:
                        case 403:
                        case 404:
                            if (error.error.errors) {
                                messageAlert = this.convertErrorsToString(error.error.errors);
                            }
                            break;
                        case 405:
                        case 409:
                        case 412:

                            break;
                        case 422:
                        case 500:
                            if (error.error.errors) {
                                messageAlert = this.convertErrorsToString(error.error.errors);
                            }
                            break;
                        case 503:
                            messageAlert = 'Servicio no disponible';
                            break;
                        case 401:
                            if (error.error.message === 'The refresh token is invalid.') {
                                this._store.dispatch(authenticationActions.logoutComplete());
                            }
                            return this.handle401Error(request, next);
                            break;
                    }

                    this._spinner.hide();
                    Swal.fire(this._messageService.BuildError(messageAlert)).then(() => {
                    });
                    return throwError(error);
                }
            }),
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.status === 200) {
                    // if (!event.url.includes('auth/login') && !event.url.includes('auth/logout')) {
                    //   this._store.dispatch(notificationsActions.unReadNotifications());
                    // }
                }
            }));
    }

    /**
     * Add the Access Token to all HTTP Requests
     */
    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Convert Errors Array to a Single String with <br> at the end
     */
    convertErrorsToString(errors) {
        let newError = '';
        for (const key in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, key)) {
                newError += errors[key] + '<br>';
            }
        }
        return newError.substring(0, newError.length - 4).toUpperCase();
    }

    /**
     * Handle HTTP Errors of type 401 for Unauthenticated
     */
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        const refreshTokenComplete$ = this._actions$.pipe(
            ofType(authenticationActions.refreshTokenComplete),
            take(1),
            switchMap(data => {
                return next.handle(this.addToken(request, data.access_token));
            }));

        if (!this._is_refreshing) {
            this._store.dispatch(authenticationActions.refreshToken());
        } else {
            this._modal.dismissAll();
            this._store.dispatch(authenticationActions.logoutComplete());
        }

        return refreshTokenComplete$;
    }
}
