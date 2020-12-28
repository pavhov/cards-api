import { Context, Next } from "koa";
import { parse }         from "query-string";

/**
 * @name VoucherListAccessor
 */
export class VoucherRedeemAccessor {
    /**
     * @name _options
     * @private
     */
    private readonly _options: any;

    /**
     * @name VoucherListAccessor
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
        if (!context.state.scopes.includes("voucher.redeem")) {
            await context.throw(401, `Access denied!`);
        }
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
