import { Context, Next } from "koa";

/**
 * @name AuthAccessor
 */
export class BearerAccessor {
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
        let {
            headers: {
                authorization,
                Authorization,
            },
        } = context.request;
        console.error(Authorization);
        Authorization = (authorization || Authorization).split(" ");
        if (!Authorization || Authorization.length !== 2) {
            await context.throw(400, `Required on header "Authorization" properties!`);
        }
        Authorization = Authorization[Authorization.length - 1];
        context.state.header = {Authorization};
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
