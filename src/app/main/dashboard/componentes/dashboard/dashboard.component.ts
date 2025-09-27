import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import * as ordersActions from '../../../orders/redux/orders.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'app/main/common/redux/general.reducers';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    private _subscription = new Subscription();

    countOrder: number = 0;
    countBranchOffice: number = 0;
    countCustomer: number = 0;
    countProducts: number = 0;

    loadingBranchOffices: boolean;
    branchsOfficesLabel = [];
    branchsOfficesData = [];
    labelBranchsOffices = "Cantidad de ordenes"

    productsLabel = [];
    productsData = [];
    labelProducts = "Cantidad de productos"

    public barChartLegend = true;
    public barChartPlugins = [];

    public barChartLegendPorduct = true;
    public barChartPluginsPorduct = [];

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [...this.branchsOfficesLabel],
        datasets: [{ data: [...this.branchsOfficesData], label: this.labelBranchsOffices }]
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: false,
    };


    public barChartDataProduct: ChartConfiguration<'bar'>['data'] = {
        labels: [...this.productsLabel],
        datasets: [{ data: [...this.productsData], label: this.labelProducts }]
    };

    public barChartOptionsProduct: ChartConfiguration<'bar'>['options'] = {
        responsive: false,
    };

    constructor(private _store: Store<AppState>, private _actions$: Actions,) {
        this.getTopBranchOffices();
        this.getTopProducts();
        this.getTotals();
    }

    ngOnInit(): void {

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.getTopBranchOfficesComplete))
                .subscribe(response => {
                    this.branchsOfficesLabel = [...response.data.branchOffices];
                    this.branchsOfficesData = [...response.data.totalOrders]

                    this.barChartData = {
                        labels: [...this.branchsOfficesLabel],
                        datasets: [{ data: [...this.branchsOfficesData], label: this.labelBranchsOffices }]
                    };
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.getTopProductsComplete))
                .subscribe(response => {
                    this.productsLabel = [...response.data.products];
                    this.productsData = [...response.data.totalProducts]

                    this.barChartDataProduct = {
                        labels: [...this.productsLabel],
                        datasets: [{ data: [...this.productsData], label: this.labelProducts }]
                    };
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(ordersActions.getTotalsComplete))
                .subscribe(response => {
                    this.countBranchOffice = response.data.countBranchOffice;
                    this.countCustomer = response.data.countCustomer;
                    this.countOrder = response.data.countOrder;
                    this.countProducts = response.data.countProducts;
                })
        );
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    getTopBranchOffices() {
        this.loadingBranchOffices = true;
        this._store.dispatch(ordersActions.getTopBranchOffices());
    }

    getTopProducts() {
        this._store.dispatch(ordersActions.getTopProducts());
    }

    getTotals() {
        this._store.dispatch(ordersActions.getTotals());
    }

}
