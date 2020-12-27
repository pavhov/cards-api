import { Context, Next } from "koa";
import { parse }         from "query-string";

/**
 * @name VoucherListAccessor
 */
export class VoucherOneAccessor {
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
        if (!context.state.scopes.includes("voucher.read")) {
            await context.throw(400, `Access denied !`);
        }
        context.state.auth = context.state.body;
        context.request.query = parse(context.request.querystring);
        const {query: {limit = 50, skip = 0}, body: {search = null, filter, sort}} = context.request;

        context.state.conditions = {
            filter: {
                ClientId: context.state.token.client.ClientId
            }
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
