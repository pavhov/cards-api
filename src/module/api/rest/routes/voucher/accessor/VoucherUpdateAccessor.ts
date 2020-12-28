import { Context, Next } from "koa";
import { parse }         from "query-string";

/**
 * @name VoucherListAccessor
 */
export class VoucherUpdateAccessor {
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
        if (!context.state.scopes.includes("voucher.write")) {
            await context.throw(401, `Access denied!`);
        }
        context.state.auth = context.state.body;
        const {body: {locations = null}} = context.request;

        context.state.conditions = {
            filter: {
                VoucherId: context.params.id,
                ClientId: context.state.token.client.ClientId
            }
        };
        context.state.values = {
            Locations: locations
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
