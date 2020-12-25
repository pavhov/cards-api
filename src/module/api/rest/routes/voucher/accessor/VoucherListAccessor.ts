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
        if (!context.state.scopes.includes("voucher.read")) {
            await context.throw(400, `Access denied !`);
        }
        context.state.auth = context.state.body;
        const {body: {limit = 50, skip = 0, search = null, filter = null, sort: {field = null, dir = "asc"},}} = context.request;

        context.state.conditions = {
            limit: limit,
            skip: skip,
            search: search,
            filter: filter,
            sort: {
                field,
                dir,
            },
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
