import { Injectable } from '@angular/core';

import { PermissionService } from '../main/common/services/permission.service';

@Injectable({
    providedIn: 'root'
})
export class MenuPermission {
    menu: any;

    constructor(private _permissionService: PermissionService) {
    }

    getMenu() {
        this.menu = [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'MENU.DASHBOARD',
                type: 'item',
                icon: '',
                newIcon: 'icon_home',
                heightIcon: 25,
                url: 'dashboard'
            },
            {
                id: 'order',
                title: 'Ordenes',
                translate: 'MENU.ORDERS',
                type: 'item',
                icon: '',
                newIcon: 'icon_ordenes',
                heightIcon: 25,
                url: 'orders/index',
                hidden: !this._permissionService.checkPermission({ name: 'order.orders.read' })
            },
            {
                id: 'client',
                title: 'Clientes',
                translate: 'MENU.CLIENTS',
                type: 'item',
                icon: '',
                newIcon: 'icon_clientes',
                heightIcon: 25,
                url: 'customers/index',
                hidden: !this._permissionService.checkPermission({ name: 'customer.customers.read' })
            },
            {
                id: 'product',
                title: 'Productos',
                translate: 'MENU.PRODUCTS',
                type: 'item',
                icon: '',
                newIcon: 'icon_productos',
                heightIcon: 25,
                url: 'products/index',
                hidden: !this._permissionService.checkPermission({ name: 'product.products.read' })
            },
            {
                id: 'branch',
                title: 'Sucursales',
                translate: 'MENU.BRANCHES',
                type: 'item',
                icon: '',
                newIcon: 'icon_sucursales',
                heightIcon: 25,
                url: 'branchOffices/index',
                hidden: !this._permissionService.checkPermission({ name: 'common.branchOffices.read' })
            },
            {
                id: 'providers-index',
                translate: 'MENU.PROVIDERS',
                title: 'Proveedores',
                type: 'item',
                icon: '',
                newIcon: 'icon_provider',
                heightIcon: 30,
                url: 'providers/index',
                hidden: !this._permissionService.checkPermission({ name: 'provider.providers.read' })
            },
            {
                id: 'inventory',
                title: 'Inventarios',
                translate: 'MENU.INVENTORIES',
                type: 'item',
                icon: '',
                newIcon: 'icon_inventories',
                heightIcon: 25,
                url: 'inventories/index',
                hidden: !this._permissionService.checkPermission({ name: 'inventory.inventories.read' })
            },
            {
                id: 'user-index',
                title: 'Usuarios',
                translate: 'MENU.USERS',
                type: 'item',
                icon: '',
                newIcon: 'icon_user',
                heightIcon: 25,
                url: 'users/index',
                hidden: !this._permissionService.checkPermission({ name: 'user.users.read' })
            },
            {
                id: 'role-index',
                title: 'Roles',
                translate: 'MENU.ROLES',
                type: 'item',
                icon: '',
                newIcon: 'icon_role',
                heightIcon: 30,
                url: 'roles/index',
                hidden: !this._permissionService.checkPermission({ name: 'user.roles.read' })
            },
            {
                id: 'configuration',
                title: 'Configuraciones',
                translate: 'MENU.CONFIGURATIONS',
                type: 'item',
                icon: '',
                newIcon: 'icon_configuration',
                heightIcon: 25,
                url: 'configurations',
                hidden: !this._permissionService.checkPermission({ name: 'configuration.configurations.read' })
            }
        ];

        return this.menu;
    }
}
