/**
 * @name HttpError
 */
export default class HttpError extends Error {
    /**
     * @name _name
     * @private
     */
    private readonly _name: string;

    /**
     * @name _message
     * @private
     */
    private readonly _message: string;

    /**
     * @name _code
     * @private
     */
    private readonly _code: number | string;

    /**
     * @name HttpError
     * @param message
     * @param code
     */
    constructor(message: any, code: number | string) {
        super();

        this._name = "HttpError";
        this._code = code;
        this._message = message;
        this.message = this.toString();

        Error.captureStackTrace(this, this.constructor);

    }

    /**
     * @name toString
     */
    public toString() {
        return JSON.stringify(this.toJSON());

    }

    /**
     * @name toJSON
     */
    public toJSON() {
        return {
            success: false,
            error: {
                name: this._name,
                code: this._code,
                message: this._message,
            },
        };

    }

}
