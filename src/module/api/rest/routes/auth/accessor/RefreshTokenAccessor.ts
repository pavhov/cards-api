import { Context, Next } from "koa";

/**
 * @name AuthAccessor
 */
export class RefreshTokenAccessor {
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
        const {
            headers: {authorization: Authorization, timestamp: Timestamp,},
            body: {grant_type, refresh_token,},
        } = context.request;
        if (!Authorization || !Timestamp) {
            await context.throw(400, `Required on header "Authorization", "Timestamp" properties!`);
        }
        if (!grant_type || !refresh_token) {
            await context.throw(400, `Required on body "grant_type", "refresh_token" properties!`);
        }
        context.state.header = {Authorization, Timestamp};
        context.state.body = {grant_type, refresh_token,};
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
