import { Context, Next } from "koa";

/**
 * @name VoucherListAccessor
 */
export class TransactionListAccessor {
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
        if (!context.state.scopes.includes("transaction.read")) {
            await context.throw(401, `Access denied!`);
        }
        context.state.auth = context.state.body;
        const {
            query: {limit = 50, skip = 0},
            body: {search = null, filter, sort},
        } = context.request;

        context.state.conditions = {
            limit: limit,
            skip: skip,
            search: search,
            filter: {...filter, ClientId: context.state.token.client.ClientId},
            sort: sort,
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
