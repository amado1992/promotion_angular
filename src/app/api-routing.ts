export const apiRoutes = {
    // Auth
    login: 'auth/login',
    logout: 'auth/logout',
    refresh_token: 'auth/login/refresh',
    logged_user: 'auth/get_logged_user',

    // File Upload
    fileUpload: 'common/temporaryFiles/uploads',
    fileUploadMultiple: 'common/temporaryFiles/uploadMultiple',

    // Ubications
    postalCodeUbications: 'common/postalCode/ubications',

    // Dashboards
    dashboardGetAllData: 'common/dashboard',

    // ConsignmentNotes
    consignmentNoteGet: 'consignmentNote/consignmentNotes',
    consignmentNoteFilter: 'consignmentNote/consignmentNotes/filter/all',
    consignmentNoteAdd: 'consignmentNote/consignmentNotes',
    consignmentNoteUpdate: 'consignmentNote/consignmentNotes/{id}',
    consignmentNoteDestroy: 'consignmentNote/consignmentNotes/{id}',
    consignmentNoteGetFile: 'consignmentNote/consignmentNotes/{id}/print',
    consignmentNoteGetFileWithoutTotals: 'consignmentNote/consignmentNotes/{id}/print/without/totals',
    consignmentNoteSendFileByEmail: 'consignmentNote/consignmentNotes/{id}/email',
    consignmentNoteAllExportExcel: 'consignmentNote/consignmentNotes/export/excel',
    consignmentNoteStamp: 'consignmentNote/consignmentNotes/{id}/stamp',
    consignmentNoteXMLStamp: 'consignmentNote/consignmentNotes/{id}/xmlStamp',
    consignmentNoteCancelStamp: 'consignmentNote/consignmentNotes/{id}/cancel',
    consignmentNoteCheckCancelStamp: 'consignmentNote/consignmentNotes/{id}/checkCancel',
    consignmentNoteGetFileAcknowledgeCancel: 'consignmentNote/consignmentNotes/{id}/acknowledgeCancel',
    consignmentNoteFilterForInformations: 'consignmentNote/consignmentNotes/filter/all/forInformations',
    consignmentNoteFilterStampForInformations: 'consignmentNote/consignmentNotes/filter/all/stamp/forInformations',
    consignmentNoteUpdatePaymentCreditStatus: 'consignmentNote/consignmentNotes/{id}/paymentCredit/status',
    consignmentNoteFilterAccountsReceivable: 'consignmentNote/consignmentNotes/accounts/receivable/filter/all',
    consignmentNoteFilterAccountsReceivableExportExcel: 'consignmentNote/consignmentNotes/accounts/receivable/export/excel',
    consignmentNoteFilterByCustomer: 'consignmentNote/consignmentNotes/customer/{id}/invoices/filter/all',
    consignmentNoteFilterCancelRelated: 'consignmentNote/consignmentNotes/{id}/invoices/related/cancel/filter/all',
    consignmentNoteDelivery: 'consignmentNote/consignmentNotes/{id}/delivery/date',

    // Informations
    informationGet: 'information/informations',
    informationGetById: 'information/informations/{id}',
    informationFilter: 'information/informations/filter/all',
    informationAdd: 'information/informations',
    informationUpdate: 'information/informations/{id}',
    informationDestroy: 'information/informations/{id}',
    informationGetFile: 'information/informations/{id}/print',
    informationAllExportExcel: 'information/informations/export/excel',
    informationExportExcel: 'information/informations/{id}/export/excel',
    informationAllConsignmentNoteStamp: 'information/informations/{id}/stampAll',
    informationOnRoute: 'information/informations/{id}/on/route',
    informationAtDestination: 'information/informations/{id}/at/destination',
    informationFinish: 'information/informations/{id}/finish',
    informationSendToPaymentCredit: 'information/informations/{id}/paymentCredit',

    // InformationBlocks
    informationBlockGetById: 'information/informationBlocks/{id}',
    informationBlockFilter: 'information/informationBlocks/filter/all',
    informationBlockAdd: 'information/informationBlocks',
    informationBlockUpdate: 'information/informationBlocks/{id}',
    informationBlockDestroy: 'information/informationBlocks/{id}',
    informationBlockGetFile: 'information/informationBlocks/{id}/print',
    informationBlockReadySend: 'information/informationBlocks/{id}/ready/send',

    // PaymentCredits
    paymentCreditGet: 'paymentCredit/paymentCredits',
    paymentCreditGetById: 'paymentCredit/paymentCredits/{id}',
    paymentCreditFilter: 'paymentCredit/paymentCredits/filter/all',
    paymentCreditGetFileCreditCounted: 'paymentCredit/paymentCredits/{id}/print/credit/counted',
    paymentCreditGetFileReceivable: 'paymentCredit/paymentCredits/{id}/print/receivable',

    // Transactions
    transactionFilter: 'paymentCredit/transactions/filter/all',
    transactionPaymentCreditStatus: 'paymentCredit/transactions/{id}/paymentCredit/status',

    // Liquidations
    liquidationGet: 'liquidation/liquidations',
    liquidationGetById: 'liquidation/liquidations/{id}',
    liquidationFilter: 'liquidation/liquidations/filter/all',
    liquidationAdd: 'liquidation/liquidations',
    liquidationUpdate: 'liquidation/liquidations/{id}',
    liquidationDestroy: 'liquidation/liquidations/{id}',
    liquidationGetFile: 'liquidation/liquidations/{id}/print',
    liquidationGetFileWithConsignmentNote: 'liquidation/liquidations/{id}/print/with/consignmentNote',
    liquidationAllExportExcel: 'liquidation/liquidations/export/excel',
    liquidationFinish: 'liquidation/liquidations/{id}/finish',
    liquidationPay: 'liquidation/liquidations/{id}/pay',

    // Banks
    bankGet: 'bank/banks',
    bankFilter: 'bank/banks/filter/all',
    bankAdd: 'bank/banks',
    bankUpdate: 'bank/banks/{id}',
    bankDestroy: 'bank/banks/{id}',
    bankAllExportExcel: 'bank/banks/export/excel',
    bankFinish: 'bank/banks/{id}/finish',
    bankFilterByType: 'bank/banks/{type}/{id}/banks/filter/all',
    bankPaymentsGet: 'bank/banks/payments/consignmentNote/{id}',
    bankTransactionsGet: 'bank/banks/transaction/{id}',

    // Remissions
    remissionGet: 'remission/remissions',
    remissionFilter: 'remission/remissions/filter/all',
    remissionAdd: 'remission/remissions',
    remissionUpdate: 'remission/remissions/{id}',
    remissionDestroy: 'remission/remissions/{id}',
    remissionGetFile: 'remission/remissions/{id}/print',
    remissionSendFileByEmail: 'remission/remissions/{id}/email',
    remissionSendToPaymentCredit: 'remission/remissions/{id}/paymentCredit',

    // Invoices
    invoiceGet: 'invoice/invoices',
    invoiceFilter: 'invoice/invoices/filter/all',
    invoiceFilterByType: 'invoice/invoices/{type}/{id}/invoices/filter/all',
    invoiceFilterCancelRelated: 'invoice/invoices/{id}/invoices/related/cancel/filter/all',
    invoiceAdd: 'invoice/invoices',
    invoiceUpdate: 'invoice/invoices/{id}',
    invoiceDestroy: 'invoice/invoices/{id}',
    invoiceGetFile: 'invoice/invoices/{id}/print',
    invoiceSendFileByEmail: 'invoice/invoices/{id}/email',
    invoiceAllExportExcel: 'invoice/invoices/export/excel',
    invoiceSendToPaymentCredit: 'invoice/invoices/{id}/paymentCredit',
    invoiceStamp: 'invoice/invoices/{id}/stamp',
    invoiceXMLStamp: 'invoice/invoices/{id}/xmlStamp',
    invoiceCancelStamp: 'invoice/invoices/{id}/cancel',
    invoiceCheckCancelStamp: 'invoice/invoices/{id}/checkCancel',
    invoiceGetFileAcknowledgeCancel: 'invoice/invoices/{id}/acknowledgeCancel',

    // DebitNotes
    debitNoteGet: 'debitNote/debitNotes',
    debitNoteFilter: 'debitNote/debitNotes/filter/all',
    debitNoteInvoices: 'debitNote/debitNotes/{type}/{id}/invoices/filter/all',
    debitNoteConsignmentNotes: 'debitNote/debitNotes/consignmentNotes/{id}/invoices/filter/all',
    debitNoteAdd: 'debitNote/debitNotes',
    debitNoteUpdate: 'debitNote/debitNotes/{id}',
    debitNoteDestroy: 'debitNote/debitNotes/{id}',
    debitNoteGetFile: 'debitNote/debitNotes/{id}/print',
    debitNoteSendFileByEmail: 'debitNote/debitNotes/{id}/email',
    debitNoteStamp: 'debitNote/debitNotes/{id}/stamp',
    debitNoteXMLStamp: 'debitNote/debitNotes/{id}/xmlStamp',
    debitNoteCancelStamp: 'debitNote/debitNotes/{id}/cancel',
    debitNoteCheckCancelStamp: 'debitNote/debitNotes/{id}/checkCancel',

    // Complements
    complementGet: 'complement/complements',
    complementGetById: 'complement/complements/{id}',
    complementFilter: 'complement/complements/filter/all',
    complementTermPaymentInvoices: 'complement/complements/{type}/{id}/invoices/filter/all',
    complementTermPaymentConsignmentNotes: 'complement/complements/consignmentNotes/{id}/invoices/filter/all',
    complementAdd: 'complement/complements',
    complementUpdate: 'complement/complements/{id}',
    complementDestroy: 'complement/complements/{id}',
    complementGetFile: 'complement/complements/{id}/print',
    complementSendFileByEmail: 'complement/complements/{id}/email',
    complementStamp: 'complement/complements/{id}/stamp',
    complementXMLStamp: 'complement/complements/{id}/xmlStamp',
    complementCancelStamp: 'complement/complements/{id}/cancel',
    complementCheckCancelStamp: 'complement/complements/{id}/checkCancel',
    complementGetFileAcknowledgeCancel: 'complement/complements/{id}/acknowledgeCancel',

    // CreditNotes
    creditNoteGet: 'creditNote/creditNotes',
    creditNoteFilter: 'creditNote/creditNotes/filter/all',
    creditNoteInvoices: 'creditNote/creditNotes/{type}/{id}/invoices/filter/all',
    creditNoteConsignmentNotes: 'creditNote/creditNotes/consignmentNotes/{id}/invoices/filter/all',
    creditNoteAdd: 'creditNote/creditNotes',
    creditNoteUpdate: 'creditNote/creditNotes/{id}',
    creditNoteDestroy: 'creditNote/creditNotes/{id}',
    creditNoteGetFile: 'creditNote/creditNotes/{id}/print',
    creditNoteSendFileByEmail: 'creditNote/creditNotes/{id}/email',
    creditNoteStamp: 'creditNote/creditNotes/{id}/stamp',
    creditNoteXMLStamp: 'creditNote/creditNotes/{id}/xmlStamp',
    creditNoteCancelStamp: 'creditNote/creditNotes/{id}/cancel',
    creditNoteCheckCancelStamp: 'creditNote/creditNotes/{id}/checkCancel',
    creditNoteGetFileAcknowledgeCancel: 'creditNote/creditNotes/{id}/acknowledgeCancel',

    // Customers
    customerGet: 'customer/customers',
    customerGetBySearch: 'customer/customers/by/search',
    customerFilter: 'customer/customers/filter/all',
    customerAdd: 'customer/customers',
    customerUpdate: 'customer/customers/{id}',
    customerDestroy: 'customer/customers/{id}',
    customerAccountGet: 'customer/customers/{id}/customerAccounts',
    customerAccountFilter: 'customer/customers/{id}/customerAccounts/filter/all',
    customerAccountAdd: 'customer/customers/{id}/customerAccounts',
    customerAccountUpdate: 'customer/customers/{id}/customerAccounts/{account_id}',
    customerAccountDestroy: 'customer/customers/{id}/customerAccounts/{account_id}',
    customerAccountChangeStatus: 'customer/customers/{id}/customerAccounts/{account_id}/changeStatus',

    // BranchOffices
    branchOfficeGet: 'common/branchOffices',
    branchOfficeFilter: 'common/branchOffices/filter/all',
    branchOfficeAdd: 'common/branchOffices',
    branchOfficeUpdate: 'common/branchOffices/{id}',
    branchOfficeDestroy: 'common/branchOffices/{id}',

    // Providers
    providerGet: 'provider/providers',
    providerFilter: 'provider/providers/filter/all',
    providerAdd: 'provider/providers',
    providerUpdate: 'provider/providers/{id}',
    providerDestroy: 'provider/providers/{id}',
    providerAccountGet: 'provider/providers/{id}/providerAccounts',
    providerAccountFilter: 'provider/providers/{id}/providerAccounts/filter/all',
    providerAccountAdd: 'provider/providers/{id}/providerAccounts',
    providerAccountUpdate: 'provider/providers/{id}/providerAccounts/{account_id}',
    providerAccountDestroy: 'provider/providers/{id}/providerAccounts/{account_id}',
    providerAccountChangeStatus: 'provider/providers/{id}/providerAccounts/{account_id}/changeStatus',
    providerGetBySearch: 'provider/providers/by/search',

    // Operators
    operatorGet: 'operator/operators',
    operatorFilter: 'operator/operators/filter/all',
    operatorAdd: 'operator/operators',
    operatorUpdate: 'operator/operators/{id}',
    operatorDestroy: 'operator/operators/{id}',

    // Persons
    personGet: 'person/persons',
    personGetBySearch: 'person/persons/by/search',
    personFilter: 'person/persons/filter/all',
    personAdd: 'person/persons',
    personUpdate: 'person/persons/{id}',
    personDestroy: 'person/persons/{id}',

    // Trailers
    trailerGet: 'trailer/trailers',
    trailerFilter: 'trailer/trailers/filter/all',
    trailerAdd: 'trailer/trailers',
    trailerUpdate: 'trailer/trailers/{id}',
    trailerDestroy: 'trailer/trailers/{id}',

    // Trucks
    truckGet: 'truck/trucks',
    truckFilter: 'truck/trucks/filter/all',
    truckAdd: 'truck/trucks',
    truckUpdate: 'truck/trucks/{id}',
    truckDestroy: 'truck/trucks/{id}',
    truckStatus: 'truck/trucks/{id}/status',

    // Products
    productGet: 'product/products',
    productFilter: 'product/products/filter/all',
    productAdd: 'product/products',
    productUpdate: 'product/products/{id}',
    productDestroy: 'product/products/{id}',
    productGetBySearch: 'product/products/by/search',
    productGetBySearchGeneral: 'product/products/by/searchGeneral',

    // InvoiceTypes
    invoiceTypeGet: 'invoice/invoiceTypes',
    invoiceTypeFilter: 'invoice/invoiceTypes/filter/all',
    invoiceTypeAdd: 'invoice/invoiceTypes',
    invoiceTypeUpdate: 'invoice/invoiceTypes/{id}',
    invoiceTypeDestroy: 'invoice/invoiceTypes/{id}',

    // Catalogs
    catalogueGet: 'common/catalogs',
    catalogueFilter: 'common/catalogs/filter/all',
    catalogueAdd: 'common/catalogs',
    catalogueUpdate: 'common/catalogs/{id}',
    catalogueDestroy: 'common/catalogs/{id}',

    //Travels
    travelAdd: 'travel/travels',
    travelFilter: 'travel/travels/filter/all',
    travelDestroy: 'travel/travels/{id}',
    travelUpdate: 'travel/travels/{id}',
    travelAllExportExcel: 'travel/travels/export/excel',

    foreignTravelAdd: 'travel/foreignTravels',
    foreignTravelFilter: 'travel/foreignTravels/filter/all',
    foreignTravelDestroy: 'travel/foreignTravels/{id}',
    foreignTravelUpdate: 'travel/foreignTravels/{id}',
    foreignTravelAllExportExcel: 'travel/foreignTravels/export/excel',

    // Users
    userGet: 'user/users',
    userFilter: 'user/users/filter/all',
    userAdd: 'user/users',
    userUpdate: 'user/users/{id}',
    userDestroy: 'user/users/{id}',
    userStatus: 'user/users/{id}/status',
    userPassword: 'user/users/account/password',
    userAccount: 'user/users/account/change',
    usersByRole: 'user/users/usersByRole/all',

    // Roles
    roleFilter: 'user/roles/filter/all',
    roleGet: 'user/roles',
    roleAdd: 'user/roles',
    roleUpdate: 'user/roles/{id}',
    roleDestroy: 'user/roles/{id}',

    // Configurations
    configurationGet: 'configuration/configurations',
    configurationUpdate: 'configuration/configurations',
    accountConfigurationGet: 'configuration/accountConfigurations',
    accountConfigurationFilter: 'configuration/accountConfigurations/filter/all',
    accountConfigurationAdd: 'configuration/accountConfigurations',
    accountConfigurationUpdate: 'configuration/accountConfigurations/{id}',
    accountConfigurationDestroy: 'configuration/accountConfigurations/{id}',
    accountConfigurationChangeStatus: 'configuration/accountConfigurations/{id}/changeStatus',
    folioConfigurationGet: 'cfdi/folios',
    folioConfigurationUpdate: 'cfdi/folios',
    billingConfigurationUpdate: 'cfdi/certificates',
    notificationConfigurationGet: 'configuration/notificationConfigurations',
    notificationConfigurationUpdate: 'configuration/notificationConfigurations',
    pacConfigurationGet: 'cfdi/pacs',
    pacConfigurationUpdate: 'cfdi/pacs',

    //Orders
    orderAdd: 'order/orders',
    orderFilter: 'order/orders/filter/all',
    orderDestroy: 'order/orders/{id}',
    orderUpdate: 'order/orders/{id}',
    orderExportExcel: 'order/orders/export/excel',
    orderTopBranchOffices: 'order/orders/report/topBranchOffices',
    orderTopProducts: 'order/orders/report/topProducts',
    orderTotals: 'order/orders/report/totals',
    orderPdf: 'order/orders/pdf',

    //Inventories
    inventoryAdd: 'inventory/inventories',
    inventoryFilter: 'inventory/inventories/filter/all',
    inventoryDestroy: 'inventory/inventories/{id}',
    inventoryUpdate: 'inventory/inventories/{id}',
    inventoryExportExcel: 'inventory/inventories/export/excel',
    adjustmentMovements: 'inventory/{id}/movements',
    inventoryMovementsFilter: 'inventory/{id}/movements/filter/all',
    inventoryPdf: 'inventory/inventories/{id}/pdf',
    movementUpdateAndDestroy: 'inventory/movements/{id}'
}
