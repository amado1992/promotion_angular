import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent, ColumnMode, SortType} from '@swimlane/ngx-datatable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {debounce} from 'lodash';
import Swal from 'sweetalert2';

import {PageModel} from '../../../common/models/page.model';
import {Filter, FilterModel} from '../../../common/models/filter.model';
import {AppState} from '../../../common/redux/general.reducers';
import * as productsActions from '../../redux/products.actions';
import {MessageService} from '../../../common/services/message.service';
import {PermissionService} from '../../../common/services/permission.service';
import {ProductsNewComponent} from '../products-new/products-new.component';
import {ProductsUpdateComponent} from '../products-update/products-update.component';
import {ProductModel} from '../../models/product.model';
import {SimpleModel} from '../../../common/models/simple.model';

@Component({
    selector: 'app-products-index',
    templateUrl: './products-index.component.html',
    styleUrls: ['./products-index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductsIndexComponent implements OnInit, OnDestroy {

    public rows = [];
    public ColumnMode = ColumnMode;
    public SortType = SortType;

    _collapseStatus = true;

    _filterForm: FormGroup;
    _filterSearch: FormGroup;
    _pageModel: PageModel;
    _filterModel: FilterModel;
    _searchFilter: boolean;

    _categories: SimpleModel[];

    _permissions = {
        'read': 'product.products.read',
        'create': 'product.products.create',
        'update': 'product.products.update',
        'destroy': 'product.products.destroy'
    };

    _permissions_values = {
        read: true,
        create: true,
        update: true,
        destroy: true
    };

    private _subscription = new Subscription();

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private _store: Store<AppState>,
                private _actions$: Actions,
                private _modalService: NgbModal,
                private _messageService: MessageService,
                private _permissionService: PermissionService) {
        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._permissions_values = this._permissionService.checkPermissionValues(this._permissions);
        this.onSearchFilter = debounce(this.onSearchFilter, 500);
    }

    ngOnInit(): void {
        this.listeningActions();
        this.initializeFilter();
        this.filterAll();
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onPageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }): void {
        this._pageModel.offset = pageInfo.offset;
        this.filterAll();
    }

    onSortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }): void {
        this._pageModel.orderDir = sortInfo.sorts[0].dir;
        this._pageModel.orderBy = sortInfo.sorts[0].prop;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onChangeLimit(event): void {
        this._pageModel.limit = event;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onCollapse() {
        this._collapseStatus = !this._collapseStatus;
    }

    onFilterAll(): void {
        this._filterSearch.reset();
        this._searchFilter = false;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onClean(): void {
        this._pageModel = new PageModel();
        this._pageModel.orderDir = 'desc';
        this._filterModel = {
            search: {},
            filters: []
        };
        this._filterForm.reset();
        this._filterForm.get('category').setValue('');
        this._filterSearch.reset();
        this.filterAll();
    }

    onSearchFilter(): void {
        this._filterForm.reset();
        this._searchFilter = true;
        this._pageModel.offset = 0;
        this.filterAll();
    }

    onModalNewProductOpen() {
        this._modalService.open(ProductsNewComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
    }

    onModalUpdateProductOpen(event, product: ProductModel) {
        event.target.closest('datatable-body-cell').blur();
        const modalRef = this._modalService.open(ProductsUpdateComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.product = product;
        modalRef.result.then();
    }

    onDestroy(product: ProductModel) {
        Swal.fire(this._messageService.BuildQuestion('¿Está seguro de eliminar este producto?', 'Eliminar producto')).then(
            (result) => {
                if (result.value) {
                    const params = {
                        id: product.id
                    };
                    this._store.dispatch(productsActions.destroyProduct({params: params}));
                }
            }
        );
    }

    listeningActions(): void {
        this._subscription.add(this._store.subscribe(state => {
            this.rows = state.products.products.value;
            this._pageModel.count = state.products.products.total;

            if (state.auth.auth) {
                this._categories = state.auth.product_categories;
            }
        }));

        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.addNewProductComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.updateProductComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );

        this._subscription.add(
            this._actions$
                .pipe(ofType(productsActions.destroyProductComplete))
                .subscribe(response => {
                    this.filterAll();
                    const messAlert = response.data.message;
                    Swal.fire(this._messageService.BuildSuccess(messAlert)).then(() => {
                    });
                })
        );
    }

    initializeFilter(): void {
        this._filterForm = new FormGroup({
            'number': new FormControl(),
            'description': new FormControl(),
            'category': new FormControl('')
        });
        this._filterSearch = new FormGroup({
            'search': new FormControl()
        });
    }

    filterAll(): void {
        this._filterModel = {
            search: {
                paginate: this._pageModel.limit,
                orderBy: this._pageModel.orderBy,
                direction: this._pageModel.orderDir
            },
            filters: this.getFilter()
        };
        if (this._pageModel.offset > 0) {
            this._filterModel.search.page = this._pageModel.offset + 1;
        }

        this._store.dispatch(productsActions.filterAllProducts({filter: this._filterModel}));
    }

    getFilter(): Filter[] {
        const filters = [];
        if (this._filterForm && !this._searchFilter) {
            for (const [key, value] of Object.entries(this._filterForm.value)) {
                if (value && value !== '') {
                    switch (key) {
                        case 'number':
                        case 'description': {
                            filters.push({attribute: key, operator: 'like', value: value.toString().trim()});
                            break;
                        }
                        case 'category': {
                            filters.push({attribute: key, operator: '=', value: value});
                            break;
                        }
                    }
                }
            }
        } else {
            if (this._filterSearch.value.search && this._filterSearch.value.search !== '') {
                filters.push({attribute: 'search', operator: 'like', value: encodeURIComponent(this._filterSearch.value.search.trim()) });
            }
        }
        return filters;
    }
}
