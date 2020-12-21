import { Context, Next } from "koa";

import { Get, Presenter } from "./../../../../../lib/decorators/Koa";

/**
 * @name ProductPresenter
 */
@Presenter({path: "/ping/pong"})
export default class PingPongPresenter {
    /**
     * @name stories
     * @private
     */
    private stories: {};

    /**
     * @name ProductPresenter
     */
    constructor() {
    }

    /**
     * @name "/:time"
     * @param context
     * @param next
     */
    @Get()
    async "/:time"(context: Context, next: Next) {
        context.body = {Time: Date.now()};
    }
}
