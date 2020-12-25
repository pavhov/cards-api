import ms              from "ms";
import util            from "util";
import * as uuid       from "uuid";
import crypto          from "crypto";
import moment          from "moment";
import ClientTask      from "../../repository/client/Task";
import ClientInterface from "../../repository/client/Interface";
import TokenTask       from "../../repository/token/Task";
import TokenInterface  from "../../repository/token/Interface";
import JWT             from "../../task/JWT";

const randomBytesAsync = util.promisify(crypto.randomBytes);

/**
 * @name Story
 */
export default class Story {
    /**
     * @name tasks
     */
    public tasks: {
        Client: ClientTask;
        Token: TokenTask;
    };

    /**
     * @name Story
     */
    public constructor() {
        this.tasks = {
            Client: ClientTask.Instance(),
            Token: TokenTask.Instance(),
        };
    }

    /**
     * @name Login
     * @param header
     * @param body
     * @param client
     * @constructor
     */
    public async Login(header: { Authorization, Timestamp, }, body: { grant_type, clientId, clientSecret, scopes, }, client: ClientInterface) {
        let baseHash = (Buffer.from(`${body.clientId}:${body.clientSecret}`)).toString("base64");
        let md5hash = crypto.createHash("md5").update(baseHash).digest("hex");
        let authSplit = header.Authorization.split("@");
        let baseAuth = `${baseHash}@${Date.now()}`;

        if (authSplit[0] !== md5hash) {
            throw new Error("wrong hash");
        }

        const [expires_in, refresh_token_expires_in] = [ms("2h"), ms("1.5y")];
        const [firstPart, EndPart] = [body.clientSecret, baseAuth];
        const refresh_token = `${firstPart}${EndPart}`;

        const jwt = new JWT(client?.token?.AccessTokenSecret || body.clientSecret, refresh_token, {expiresIn: ms(expires_in)});

        const now = moment().utc().toDate();
        if (client?.token) {
            if (client.token.ExpiresIn.getTime() >= now.getTime()) {
                return {
                    access_token: client.token.AccessToken,
                    expires_in: ms(client.token.ExpiresIn.getTime() - Date.now()),
                    refresh_token: client.token.RefreshToken,
                    refresh_token_expires_in: ms(client.token.RefreshTokenExpiresIn.getTime() - Date.now()),
                };
            } else {
                throw new Error("JWTExpired");
            }
        }

        const access_token = jwt.sign({
            clientId: body.clientId
        }, {
            algorithm: "HS256",
            audience: body.scopes.join("|"),
            jwtid: uuid.v4(),
        });

        const result = {access_token, expires_in: ms(expires_in), refresh_token, refresh_token_expires_in: ms(refresh_token_expires_in)};
        await this.createClient({
            ClientIndex: body.clientId,
            ClientSecret: body.clientSecret,
            Scopes: body.scopes,
        }, result);
        return result;
    }

    /**
     * @name Refresh
     * @param header
     * @param body
     * @param token
     * @constructor
     */
    public async Refresh(header: { Authorization, Timestamp, }, body: { grant_type, refresh_token, }, token: TokenInterface) {
        const expires_in = ms("2h");

        let newTokenSecret: Buffer | any = await randomBytesAsync(token.RefreshToken.length);
        newTokenSecret = newTokenSecret.toString("hex");
        const jwt = new JWT(newTokenSecret, token.AccessTokenSecret || token.client.ClientSecret, {expiresIn: ms(expires_in)});
        const refreshedToken = jwt.refresh(token.AccessToken, {
            jwtid: uuid.v4(),
            algorithm: "HS256",
            verify: {
                algorithms: ["HS256"],
                audience: token.client.Scopes.join("|"),
            }
        });
        const updateResult = await this.tasks.Token.updateOne({
            AccessToken: refreshedToken,
            AccessTokenSecret: newTokenSecret,
            ExpiresIn: moment().add(expires_in).utc().toDate(),
        }, {
            where: {
                TokenId: token.TokenId,
            },
            returning: true,
        });
        if (updateResult[0] === 0) {
            throw new Error("TokenNotUpdated");
        }
        const updatedToken = (updateResult[1][0].toJSON() as TokenInterface);

        return {
            access_token: updatedToken.AccessToken,
            expires_in: ms(updatedToken.ExpiresIn.getTime() - Date.now()),
        };
    }

    /**
     * @name createClient
     * @param clientData
     * @param tokenData
     * @private
     */
    private async createClient(clientData: ClientInterface, tokenData: any) {
        const tr = await this.tasks.Client.transaction();
        try {
            const client = await this.tasks.Client.createOne(clientData, {transaction: tr});

            const [ExpiresIn, RefreshTokenExpiresIn] = [
                moment().add(tokenData.expires_in).utc().toDate(), moment().add(tokenData.refresh_token_expires_in).utc().toDate()
            ];

            const token = await this.tasks.Token.createOne({
                ClientId: (client as any).ClientId,
                AccessToken: tokenData.access_token,
                RefreshToken: tokenData.refresh_token,
                ExpiresIn: ExpiresIn,
                RefreshTokenExpiresIn: RefreshTokenExpiresIn,
                AccessTokenSecret: clientData.ClientSecret,
            }, {transaction: tr});
            await tr.commit();

            return {client, token};

        } catch (e) {
            await tr.rollback();
            throw e;
        }
    }

}
