import { Context, Next } from "koa";
import sequelize         from "sequelize";
import moment            from "moment";
import AuthStory         from "../../../../../story/auth/Story";
import { error }         from "../../../../../../lib/utils/Logger";

/**
 * @name AuthAccessor
 */
export class RefreshTokenWithClientAccessor {
    /**
     * @name stories
     * @private
     */
    private stories: {
        Auth: AuthStory;
    };

    /**
     * @name _options
     * @private
     */
    private readonly _options: any;

    /**
     * @name ClientAccessor
     */
    constructor() {
        this.stories = {
            Auth: new AuthStory,
        };
    }

    /**
     * @name before
     * @param context
     * @param next
     * @protected
     */
    protected async before(context: Context, next: Next): Promise<any> {
        try {
            const client = await this.stories.Auth.tasks.Token.getOne({
                rejectOnEmpty: true,
                where: {
                    RefreshToken: context.state.body.refresh_token,
                    ExpiresIn: {
                        [sequelize.Op.lt]: moment().utc().toDate(),
                    }
                },
                include: this.stories.Auth.tasks.Token.client(),
            });
            context.state.token = client && client.toJSON();
        } catch (e) {
            error(e);
            await context.throw(404, new Error("NotFound"));
            return;
        }
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
