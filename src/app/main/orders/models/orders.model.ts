import { BranchOfficeModel } from "app/main/branch-offices/models/branch-office.model";
import { CustomerModel } from "app/main/customers/models/customer.model";

export class OrderModel {
    id: number;
    folio: string;
    customer_id: number;
    branch_offices_id: number;
    date_created: Date;

    total_revenues: number;
    sale_price: number;
    revenues: number;
    url_file: string;
    url_complete: string;
    total_quantity: number;
    observation: string;
    lote: string;
    expiration_date: Date;

    products: OrderProductsModel[];
    customer: CustomerModel;
    branchOffices:BranchOfficeModel;
}

export interface OrderProductsModel {
    description: string;
    amount: number;
    price: number;
    total: number;
    product_id: number
}

export class TemporaryFileDto {
    public id;
    public url;
    public url_complete;
    public name;
    public model;
}