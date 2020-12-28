import { Context, Next } from "koa";

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
            await context.throw(401, `Access denied!`);
        }
        context.state.auth = context.state.body;

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
