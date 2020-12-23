import { Context, Next }        from "koa";
import { Post, Presenter, Use } from "../../../../../lib/decorators/Koa";
import { AuthAccessor }         from "../auth/accessor/AuthAccessor";
import { ClientAccessor }       from "../auth/accessor/ClientAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/transaction"})
export default class TransactionPresenter {
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

}
