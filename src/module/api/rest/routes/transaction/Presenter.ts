import { Context, Next }           from "koa";
import { Get, Presenter, Use }     from "../../../../../lib/decorators/Koa";
import VoucherStory                from "../../../../story/voucher/Story";
import { BearerAccessor }          from "../auth/accessor/BearerAccessor";
import { JWTAccessor }             from "../auth/accessor/JWTAccessor";
import { TransactionListAccessor } from "./accessor/TransactionListAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/transaction"})
export default class TransactionPresenter {
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
     * @name "/"
     * @param context
     * @param next
     */
    @Get()
    @Use(BearerAccessor)
    @Use(JWTAccessor)
    @Use(TransactionListAccessor)
    async "/"(context: Context, next: Next) {
        try {
            const {conditions} = context.state;
            const res = await this.stories.Voucher.transactions(conditions);
            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            e.status = e.status || 400;
            await context.throw(e);
        }

    }

}
