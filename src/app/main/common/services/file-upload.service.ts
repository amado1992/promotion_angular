import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {apiRoutes} from '../../../api-routing';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(private _apiService: ApiService) {
    }

    fileUpload(params): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('model', params.model);
        formData.append('file', params.file, params.filename);
        formData.append('_method', 'POST');

        return this._apiService.postWithFile(apiRoutes.fileUpload, formData);
    }

    fileUploadMultiple(params): Observable<any> {
        return this._apiService.postWithFile(apiRoutes.fileUploadMultiple, params);
    }
}
