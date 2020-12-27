import { Context, Next } from "koa";
import sequelize         from "sequelize";
import moment            from "moment";
import AuthStory         from "../../../../../story/auth/Story";
import { error }         from "../../../../../../lib/utils/Logger";
import JWT               from "../../../../../task/JWT";
import ms                from "ms";

/**
 * @name AuthAccessor
 */
export class JWTAccessor {
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
        const token = await this.stories.Auth.tasks.Token.getOne({
            rejectOnEmpty: false,
            where: {
                AccessToken: context.state.header.Authorization,
                ExpiresIn: {
                    [sequelize.Op.gt]: moment().utc().toDate(),
                }
            },
            include: this.stories.Auth.tasks.Token.client(),
        });
        if (!token) {
            throw new Error("NotValidToken");
        }
        context.state.token = token && token.toJSON();

        const jwt = new JWT(null, context.state.token.AccessTokenSecret, {
            expiresIn: ms(context.state.token.ExpiresIn.getTime() - moment().utc().toDate().getTime())
        });
        const payload: any = jwt.verify(context.state.header.Authorization, {
            algorithms: ["HS256"],
        });
        context.state.scopes = payload.aud.split("|");
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
