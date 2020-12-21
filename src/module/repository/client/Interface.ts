import TokenInterface from "../token/Interface";

/**
 * @name Interface
 */
export default interface Interface {
    ClientId?: string;
    ClientIndex: string;
    ClientSecret: string;
    Scopes: string;
    token?: TokenInterface
    tokens?: TokenInterface
}
