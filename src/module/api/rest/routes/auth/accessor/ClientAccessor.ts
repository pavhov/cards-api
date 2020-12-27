import { Context, Next } from "koa";
import sequelize         from "sequelize";
import moment            from "moment";
import AuthStory         from "../../../../../story/auth/Story";
import { error }         from "../../../../../../lib/utils/Logger";

/**
 * @name AuthAccessor
 */
export class ClientAccessor {
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
        const client = await this.stories.Auth.tasks.Client.getOne({
            rejectOnEmpty: false,
            where: {
                ClientIndex: context.state.body.clientId,
            },
            include: this.stories.Auth.tasks.Client.token({
                RefreshTokenExpiresIn: {
                    [sequelize.Op.gt]: moment().utc().toDate(),
                },
            }),
        });
        // await context.assert(client, 401, `Unauthorized!`);
        context.state.client = client && client.toJSON();
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
