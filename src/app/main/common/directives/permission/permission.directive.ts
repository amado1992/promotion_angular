import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

import {PermissionService} from '../../services/permission.service';

@Directive({
    selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {

    @Input('appPermission') _actions: string;

    constructor(private _permissionService: PermissionService,
                private _templateRef: TemplateRef<any>,
                private _viewContainerRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        if (this._permissionService.checkPermission({name: this._actions})) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainerRef.clear();
        }
    }
}
