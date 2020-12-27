import { Context, Next }                    from "koa";
import { Get, Patch, Post, Presenter, Use } from "../../../../../lib/decorators/Koa";

import { VoucherCreateAccessor } from "./accessor/VoucherCreateAccessor";

import VoucherStory              from "../../../../story/voucher/Story";
import { BearerAccessor }        from "../auth/accessor/BearerAccessor";
import { JWTAccessor }           from "../auth/accessor/JWTAccessor";
import { VoucherListAccessor }   from "./accessor/VoucherListAccessor";
import { VoucherOneAccessor }    from "./accessor/VoucherOneAccessor";
import { VoucherRedeemAccessor } from "./accessor/VoucherRedeemAccessor";
import { VoucherUpdateAccessor } from "./accessor/VoucherUpdateAccessor";
import { VoucherVoidAccessor }   from "./accessor/VoucherVoidAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/voucher"})
export default class VoucherPresenter {
    /**
     * @name stories
     * @private
     */
    private stories: {
        Voucher: VoucherStory,
    };

    /**
     * @name AuthPresenter
     */
    constructor() {
        this.stories = {
            Voucher: new VoucherStory,
        };
    }

    /**
     * @name "/create"
     * @param context
     * @param next
     */
    @Post({path: "/"})
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherCreateAccessor)
    async "/create"(context: Context, next: Next) {
        try {
            const {token: {client}, body} = context.state;
            const res = await this.stories.Voucher.create(client, body);
            await context.assert(res, 400, "wrong");
            context.status = 201;
            context.body = res;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

    /**
     * @name "/"
     * @param context
     * @param next
     */
    @Get()
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherListAccessor)
    async "/"(context: Context, next: Next) {
        try {
            const {conditions} = context.state;
            const res = await this.stories.Voucher.list(conditions);
            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

    /**
     * @name "/:id"
     * @param context
     * @param next
     */
    @Get()
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherOneAccessor)
    async "/:id"(context: Context, next: Next) {
        try {
            const {conditions} = context.state;
            const res = await this.stories.Voucher.one({...conditions.filter, VoucherId: context.params.id});
            await context.assert(res, 400, "Empty");
            context.body = res;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

    /**
     * @name /voucher/:id/redeemed
     * @param context
     * @param next
     */
    @Patch()
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherRedeemAccessor)
    async "/voucher/:id/redeemed"(context: Context, next: Next) {
        try {
            await this.stories.Voucher.redeemed(context.params.id);
            context.status = 204;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

    /**
     * @name /voucher/:id/location
     * @param context
     * @param next
     */
    @Patch()
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherUpdateAccessor)
    async "/:id/location"(context: Context, next: Next) {
        try {
            await this.stories.Voucher.location(context.state.conditions.filter, context.state.values.Locations);
            context.status = 204;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

    /**
     * @name /:id
     * @param context
     * @param next
     */
    @Patch({path: "/:id"})
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(VoucherVoidAccessor)
    async "/:id/remove"(context: Context, next: Next) {
        try {
            const {conditions} = context.state;
            await this.stories.Voucher.delete(context.params.id);
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

}
