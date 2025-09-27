import { BranchOfficeModel } from "app/main/branch-offices/models/branch-office.model";
import { ProductModel } from "app/main/products/models/product.model";
import { ProviderModel } from "app/main/providers/models/provider.model";

export class InventoryModel {
    id: number;
    product_id: number;
    branch_offices_id: number;
    quantity: number;
    sold: number;
    given: number;
    folio: number;
    sale_price: number;
    purchase_price: number;
    revenues: number;
    date_created: Date;
    branchOffices: BranchOfficeModel;
    product: ProductModel;
    provider: ProviderModel;
    providers_id: number | null;
    unit_measurements_id: number | null;
    physical_status_id: number | null;
    physical_status: string;
    observation: string;
    unitMeasurement: any;
    
    constructor() {
        this.id = 0;
        this.quantity = 0;
        this.given = 0;
        this.sold = 0;
    }
}