import ClientInterface from "../client/Interface";


/**
 * @name Interface
 */
export default interface Interface {
    TokenId?: string;
    ClientId: string;
    AccessToken: string;
    AccessTokenSecret: string;
    ExpiresIn: Date;
    RefreshToken: string;
    RefreshTokenExpiresIn: Date;

    client?: ClientInterface;
}
