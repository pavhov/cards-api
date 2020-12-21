/**
 * @name Interface
 */
export default interface Interface {
    TokenId?: string;
    ClientId: string;
    AccessToken: string;
    ExpiresIn: Date;
    RefreshToken: string;
    RefreshTokenExpiresIn: Date;
}
