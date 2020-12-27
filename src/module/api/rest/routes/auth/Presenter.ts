import { Context, Next }        from "koa";
import { Post, Presenter, Use } from "../../../../../lib/decorators/Koa";
import { AuthAccessor }         from "./accessor/AuthAccessor";

import AuthStory                          from "../../../../story/auth/Story";
import { ClientAccessor }                 from "./accessor/ClientAccessor";
import { RefreshTokenAccessor }           from "./accessor/RefreshTokenAccessor";
import { RefreshTokenWithClientAccessor } from "./accessor/RefreshTokenWithClientAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/auth"})
export default class AuthPresenter {
    /**
     * @name stories
     * @private
     */
    private stories: {
        Auth: AuthStory;
    };

    /**
     * @name AuthPresenter
     */
    constructor() {
        this.stories = {
            Auth: new AuthStory,
        };
    }

    /**
     * @name "/"
     * @param context
     * @param next
     */
    @Post()
    @Use(AuthAccessor)
    @Use(ClientAccessor)
    async "/"(context: Context, next: Next) {
        try {
            const {header, body, client} = context.state;
            const res: { access_token, expires_in, refresh_token, refresh_token_expires_in } = await this.stories.Auth.Login(header, body, client);

            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            console.log(e);
            await context.throw(400, e.message);
        }

    }

    /**
     * @name "/token"
     * @param context
     * @param next
     */
    @Post()
    @Use(RefreshTokenAccessor)
    @Use(RefreshTokenWithClientAccessor)
    async "/token"(context: Context, next: Next) {
        try {
            const {header, body, token} = context.state;
            const res: { access_token, expires_in } = await this.stories.Auth.Refresh(header, body, token);

            await context.assert(res, 400, "wrong");
            context.body = res;
        } catch (e) {
            await context.throw(400, e.message);
        }

    }

}
