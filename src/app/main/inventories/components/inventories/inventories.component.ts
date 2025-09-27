import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-inventories',
    templateUrl: './inventories.component.html',
    styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {

    _disabled = false;

    constructor() {
    }

    ngOnInit(): void {
    }
}
