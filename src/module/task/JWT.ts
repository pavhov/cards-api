import * as jwt                                                                             from "jsonwebtoken";
import { JsonWebTokenError, NotBeforeError, SignOptions, TokenExpiredError, VerifyOptions } from "jsonwebtoken";
import { error }                                                                            from "../../lib/utils/Logger";

export default class JWT {
    private readonly secretOrPrivateKey;
    private readonly secretOrPublicKey;
    private readonly options;

    constructor(secretOrPrivateKey: string, secretOrPublicKey: string, options?: SignOptions) {
        this.secretOrPrivateKey = secretOrPrivateKey;
        this.secretOrPublicKey = secretOrPublicKey;
        this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
    }

    public sign(payload: any, signOptions?: SignOptions) {
        const jwtSignOptions = Object.assign({}, signOptions, this.options);
        return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    };

    public verify(token: any, signOptions?: VerifyOptions) {
        const jwtSignOptions = Object.assign({}, signOptions, this.options, {jwtid: signOptions.jwtid});
        return jwt.verify(token, this.secretOrPublicKey, jwtSignOptions);
    };

    public refresh(token: string, refreshOptions?: Partial<SignOptions> & { verify: VerifyOptions }) {
        let payload: any;
        try {
            payload = this.verify(token, refreshOptions.verify);
        } catch (e: unknown | NotBeforeError | JsonWebTokenError | TokenExpiredError) {
            if (e instanceof TokenExpiredError) {
                payload = jwt.decode(token, {complete: true, json: true});
                payload = payload.payload;
            } else {
                error(e);
            }
        }
        if (!payload) {
            throw new Error("WrongToken");
        }
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti;
        delete refreshOptions.verify;

        return this.sign(payload, refreshOptions);
    }
}
