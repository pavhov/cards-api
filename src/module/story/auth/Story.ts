import ms              from "ms";
import crypto          from "crypto";
import moment          from "moment";
import ClientTask      from "../../repository/client/Task";
import ClientInterface from "../../repository/client/Interface";
import TokenTask       from "../../repository/token/Task";
import JWT             from "../../task/JWT";

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
        let baseHash = (new Buffer(`${body.clientId}:${body.clientSecret}`)).toString("base64");
        let md5hash = crypto.createHash("md5").update(baseHash).digest("hex");
        let authSplit = header.Authorization.split("@");
        let baseAuth = `${baseHash}@${Date.now()}`;

        if (authSplit[0] !== md5hash) {
            throw new Error("wrong hash");
        }

        const [expires_in, refresh_token_expires_in] = [ms("2h"), ms("1.5y")];
        const [firstPart, EndPart] = [body.clientSecret, baseAuth];
        const refresh_token = `${firstPart}${EndPart}`;

        const jwt = new JWT(body.clientSecret, refresh_token, {expiresIn: ms(expires_in)});

        const now = moment().utc().toDate();
        if (client.token) {
            if (client.token.ExpiresIn.getTime() >= now.getTime()) {
                return {
                    access_token: client.token.AccessToken,
                    expires_in: client.token.ExpiresIn.getTime(),
                    refresh_token: client.token.RefreshToken,
                    refresh_token_expires_in: client.token.RefreshTokenExpiresIn.getTime(),
                };
            } else {
                throw new Error("JWT expired");
            }
        }

        const access_token = jwt.sign({
            clientId: body.clientId
        }, {
            algorithm: "HS256",
            audience: body.scopes.join("|"),
        });

        const result = {access_token, expires_in, refresh_token, refresh_token_expires_in};
        await this.createClient({
            ClientIndex: body.clientId,
            ClientSecret: body.clientSecret,
            Scopes: body.scopes,
        }, result);
        return result;
    }

    public async Refresh(header: { Authorization, Timestamp, }, body: { grant_type, clientId, clientSecret, scopes, }, client: ClientInterface) {
        const result = {access_token: "", expires_in: "", refresh_token: "", refresh_token_expires_in: ""};
        return result;
    }

    /**
     * @name createClient
     * @param clientData
     * @param tokenData
     * @private
     */
    private async createClient(clientData: ClientInterface, tokenData: any) {
        const client = await this.tasks.Client.createOne(clientData);

        const [ExpiresIn, RefreshTokenExpiresIn] = [
            moment().add(tokenData.expires_in).utc().toDate(), moment().add(tokenData.refresh_token_expires_in).utc().toDate()
        ];

        const token = await this.tasks.Token.createOne({
            ClientId: (client as any).ClientId,
            AccessToken: tokenData.access_token,
            RefreshToken: tokenData.refresh_token,
            ExpiresIn: ExpiresIn,
            RefreshTokenExpiresIn: RefreshTokenExpiresIn,
        });

        return {client, token};
    }

}
