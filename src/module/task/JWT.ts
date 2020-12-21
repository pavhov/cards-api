import * as jwt        from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

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

    public verify(token: any, signOptions?: SignOptions) {
        const jwtSignOptions = Object.assign({}, signOptions, this.options);
        return jwt.verify(token, this.secretOrPrivateKey, jwtSignOptions);
    };

    public refresh(token: string, refreshOptions?: any) {
        const payload: any = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify);
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
        const jwtSignOptions = Object.assign({}, this.options, {jwtid: refreshOptions.jwtid});
        // The first signing converted all needed options into claims, they are already in the payload
        return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
    }
}
