import { Context, Next } from "koa";

/**
 * @name AuthAccessor
 */
export class AuthAccessor {
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
            headers: {
                authorization,
                Authorization,
                timestamp: Timestamp,
            },
            body: {grant_type, clientId, clientSecret, scopes,},
        } = context.request;
        if (!(authorization || Authorization) || !Timestamp) {
            await context.throw(400, `Required on header "Authorization", "Timestamp" properties!`);
        }
        if (!grant_type || !clientId || !clientSecret || !scopes) {
            await context.throw(400, `Required on body "grant_type", "clientId", "clientSecret", "scopes" properties!`);
        }
        context.state.header = {
            Authorization: (authorization || Authorization),
            Timestamp
        };
        context.state.body = {grant_type, clientId, clientSecret, scopes};
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
