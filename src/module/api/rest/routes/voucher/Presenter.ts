import { Context, Next }                    from "koa";
import { Get, Patch, Post, Presenter, Use } from "../../../../../lib/decorators/Koa";
import { AuthAccessor }                     from "../auth/accessor/AuthAccessor";
import { ClientAccessor }                   from "../auth/accessor/ClientAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/voucher"})
export default class VoucherPresenter {
    /**
     * @name stories
     * @private
     */
    private stories: {};

    /**
     * @name AuthPresenter
     */
    constructor() {
        this.stories = {};
    }

    /**
     * @name "/"
     * @param context
     * @param next
     */
    @Post({path: "/"})
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/create"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

    /**
     * @name "/"
     * @param context
     * @param next
     */
    @Get()
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

    /**
     * @name "/:id"
     * @param context
     * @param next
     */
    @Get()
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/:id"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

    /**
     * @name /voucher/:id/redeemed
     * @param context
     * @param next
     */
    @Patch()
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/voucher/:id/redeemed"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 204, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

    /**
     * @name /voucher/:id/location
     * @param context
     * @param next
     */
    @Patch()
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/:id/location"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 204, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

    /**
     * @name /:id
     * @param context
     * @param next
     */
    @Patch({path: "/:id"})
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/:id/remove"(context: Context, next: Next) {
        try {
            const {client} = context.state;
            const res = {};

            await context.assert(res, 204, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }


}
