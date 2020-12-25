import { Context, Next } from "koa";

/**
 * @name VoucherCreateAccessor
 */
export class VoucherCreateAccessor {
    /**
     * @name _options
     * @private
     */
    private readonly _options: any;

    /**
     * @name UserPhotoAccessor
     */
    constructor() {
    }

    /**
     * @name before
     * @param context
     * @param next
     * @protected
     */
    protected async before(context: Context, next: Next): Promise<any> {
        if (!context.state.scopes.includes("voucher.write")) {
            await context.throw(400, `Access denied !`);
        }
        context.state.auth = context.state.body;
        const {body: {batch_no, locations, items, valid_start_dtm, valid_end_dtm}} = context.request;

        if (!items || !valid_start_dtm || !valid_end_dtm) {
            await context.throw(400, `Required on body "items", "valid_start_dtm", "valid_end_dtm" !`);
        }

        context.state.body = {
            BatchNo: batch_no,
            Locations: locations,
            Items: items,
            ValidStartDtm: valid_start_dtm,
            ValidEndDtm: valid_end_dtm,
        };
        await next();
    }

    /**
     * @name after
     * @param context
     * @param next
     * @protected
     */
    protected async after(context: Context, next: Next): Promise<any> {
        await context.throw(404);
    }
}
