/**
 * Class to store the paging items.
 */
export class PageModel {
    /** Number of items on each page. */
    limit: number;
    /** Total number of items on all pages. */
    count: number;
    /** Number of pages to show from those available. */
    offset: number;
    /** Field by which we are going to order. */
    orderBy: string;
    /** Address in which we are going to order. Possible values (DESC or ASC) */
    orderDir: string;

    constructor(limit = 10,
                offset = 0,
                orderBy = 'created_at',
                orderDir = 'asc',
                count = 0) {
        this.limit = limit;
        this.offset = offset;
        this.orderBy = orderBy;
        this.orderDir = orderDir;
        this.count = count;
    }
}
